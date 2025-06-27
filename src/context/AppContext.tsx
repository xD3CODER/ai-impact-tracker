import type {
	DailyCarbonData,
	ServiceStats,
	TotalFootprint,
} from "@/types/carbon";
import { logger } from "@/utils/core/logger";
import { ReactiveStorage } from "@/utils/storage/reactive";
import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import type { ReactNode } from "react";

type ViewMode = "daily" | "global";

// Application configuration interface (integrated from ReactiveConfig)
interface AppConfig {
	toastEnabled: boolean;
}

// Default configuration
const DEFAULT_CONFIG: AppConfig = {
	toastEnabled: true,
};

// Storage keys
const STORAGE_KEYS = {
	CONFIG: "app_config",
} as const;

interface AppContextType {
	// Current data according to mode
	stats: TotalFootprint;
	todayData: DailyCarbonData | null;

	// Active service
	currentService: string;
	setCurrentService: (service: string) => void;
	currentServiceStats: ServiceStats;

	// Active requests state
	isRequestActive: boolean;

	// Display mode (read-only once set)
	viewMode: ViewMode;

	// Configuration (integrated from ReactiveConfig)
	config: AppConfig;
	updateConfig: (updates: Partial<AppConfig>) => Promise<void>;

	// Convenience methods for configuration
	toastEnabled: boolean;
	onToastToggle: (enabled: boolean) => void;
	onReset: () => void;

	// Loading states (integrated from useReactiveStorage)
	loading: boolean;
	error: string | null;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
	const ctx = useContext(AppContext);
	if (!ctx)
		throw new Error("useAppContext must be used within an AppContext.Provider");
	return ctx;
};

// Hooks of convenience for configuration
export const useAppConfig = () => {
	const { config, updateConfig } = useAppContext();
	return [config, updateConfig] as const;
};

export const useToastConfig = () => {
	const { toastEnabled, onToastToggle } = useAppContext();
	return [toastEnabled, onToastToggle] as const;
};

// Convenience hook for active requests state
export const useIsRequestActive = (serviceName?: string) => {
	const { isRequestActive, currentService } = useAppContext();
	// If no serviceName is provided, use the current service
	return serviceName
		? serviceName === currentService
			? isRequestActive
			: false
		: isRequestActive;
};

interface AppContextProviderProps {
	children: ReactNode;
	viewMode?: ViewMode; // Data display mode (daily or global)
	defaultCurrentService?: string; // Allow setting default service (useful for overlay)
}

// Function to convert DailyCarbonData to TotalFootprint
const convertDailyToTotal = (dailyData: DailyCarbonData): TotalFootprint => {
	return {
		requests: dailyData.requests,
		carbon: dailyData.totalCarbon,
		water: dailyData.totalWater,
		totalDuration: dailyData.totalDuration,
		services: dailyData.services,
	};
};

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
	children,
	viewMode = "daily", // Default "daily", but can be overridden
	defaultCurrentService = "", // Default empty, but can be overridden
}) => {
	// No need for state for viewMode, we use the prop directly
	const [currentService, setCurrentService] = useState<string>(
		defaultCurrentService,
	);
	const [config, setConfig] = useState<AppConfig>({ ...DEFAULT_CONFIG });

	// Data states (integrated from useReactiveStorage)
	const [rawGlobalStats, setRawGlobalStats] = useState<TotalFootprint | null>(
		null,
	);
	const [rawTodayData, setRawTodayData] = useState<DailyCarbonData | null>(
		null,
	);
	const [rawServiceStats, setRawServiceStats] = useState<ServiceStats | null>(
		null,
	);
	const [isRequestActive, setIsRequestActive] = useState<boolean>(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Initialization of configuration
	useEffect(() => {
		const loadConfig = async () => {
			try {
				logger.info("🔧 AppContext - Loading configuration");

				if (typeof chrome !== "undefined" && chrome.storage?.local) {
					const result = await chrome.storage.local.get([STORAGE_KEYS.CONFIG]);
					const savedConfig = result[STORAGE_KEYS.CONFIG];

					if (savedConfig) {
						const loadedConfig = { ...DEFAULT_CONFIG, ...savedConfig };
						setConfig(loadedConfig);
						logger.info("📥 Configuration loaded:", loadedConfig);
					} else {
						// Save default config
						await chrome.storage.local.set({ [STORAGE_KEYS.CONFIG]: config });
						logger.info("💾 Default configuration saved");
					}
				}
			} catch (error) {
				logger.error("❌ Error loading configuration:", error);
			}
		};

		loadConfig();
	}, []);

	// Initialization and data reactivity system (integrated from useReactiveStorage)
	useEffect(() => {
		let isActive = true;

		const loadInitialData = async () => {
			try {
				setLoading(true);
				setError(null);

				// Load initial data
				const [globalStats, todayData] = await Promise.all([
					ReactiveStorage.getGlobalStats(),
					ReactiveStorage.getTodayData(),
				]);

				if (isActive) {
					setRawGlobalStats(globalStats);
					setRawTodayData(todayData);
					logger.info("📊 AppContext - Initial data loaded");
				}
			} catch (err) {
				if (isActive) {
					setError(err instanceof Error ? err.message : "Unknown error");
					logger.error("❌ Error loading initial data:", err);
				}
			} finally {
				if (isActive) {
					setLoading(false);
				}
			}
		};

		// Subscribe to changes in ReactiveStorage
		const unsubscribe = ReactiveStorage.subscribe(async () => {
			try {
				logger.info("🔄 AppContext - Update detected via ReactiveStorage");

				const [globalStats, todayData] = await Promise.all([
					ReactiveStorage.getGlobalStats(),
					ReactiveStorage.getTodayData(),
				]);

				if (isActive) {
					setRawGlobalStats(globalStats);
					setRawTodayData(todayData);
				}
			} catch (err) {
				if (isActive) {
					setError(err instanceof Error ? err.message : "Unknown error");
					logger.error("❌ Error updating data:", err);
				}
			}
		});

		loadInitialData();

		return () => {
			isActive = false;
			unsubscribe();
		};
	}, []);

	// Update current service stats and active requests state
	useEffect(() => {
		let isActive = true;

		const updateServiceData = async () => {
			try {
				// Update service stats
				if (rawTodayData && currentService) {
					const serviceData = rawTodayData.services[currentService] || {
						requests: 0,
						carbon: 0,
						water: 0,
						totalDuration: 0,
					};
					if (isActive) {
						setRawServiceStats(serviceData);
					}
				} else {
					if (isActive) {
						setRawServiceStats(null);
					}
				}

				// Check active requests state
				if (
					currentService &&
					typeof chrome !== "undefined" &&
					chrome.storage?.local
				) {
					const activeRequestsData = await chrome.storage.local.get([
						"activeRequests",
					]);
					const activeRequests = activeRequestsData.activeRequests || {};
					const serviceActive = !!activeRequests[currentService]?.isActive;

					if (isActive) {
						setIsRequestActive(serviceActive);
					}
				}
			} catch (err) {
				logger.error("❌ Error updating service data:", err);
				if (isActive) {
					setIsRequestActive(false);
				}
			}
		};

		updateServiceData();

		// Also subscribe to changes for active requests
		const unsubscribe = ReactiveStorage.subscribe(() => {
			updateServiceData();
		});

		return () => {
			isActive = false;
			unsubscribe();
		};
	}, [currentService, rawTodayData]);

	// Determine data to display according to mode
	const finalLoading = loading;
	const finalError = error;

	let stats: TotalFootprint;
	if (viewMode === "daily" && rawTodayData) {
		stats = convertDailyToTotal(rawTodayData);
	} else if (viewMode === "global" && rawGlobalStats) {
		stats = rawGlobalStats;
	} else {
		// Default values
		stats = {
			requests: 0,
			carbon: 0,
			water: 0,
			totalDuration: 0,
			services: {},
		};
	}

	// Current service stats with default values
	const currentServiceStats: ServiceStats = rawServiceStats || {
		requests: 0,
		carbon: 0,
		water: 0,
		totalDuration: 0,
	};

	// Handler to update configuration
	const updateConfig = useCallback(
		async (updates: Partial<AppConfig>) => {
			const newConfig = { ...config, ...updates };
			setConfig(newConfig);

			// Save in storage
			try {
				if (typeof chrome !== "undefined" && chrome.storage?.local) {
					await chrome.storage.local.set({ [STORAGE_KEYS.CONFIG]: newConfig });
					logger.info("💾 Configuration saved:", updates);
				}
			} catch (error) {
				logger.error("❌ Error saving configuration:", error);
			}
		},
		[config],
	);

	// Handler to enable/disable toast
	const onToastToggle = useCallback(
		async (enabled: boolean) => {
			await updateConfig({ toastEnabled: enabled });
		},
		[updateConfig],
	);

	// Handler to reset global (all stats)
	const onReset = useCallback(async () => {
		// Ask for confirmation before deleting data
		if (confirm(i18n.t("confirmReset"))) {
			try {
				await ReactiveStorage.clearAllData();
				logger.info("✅ All data has been reset");
			} catch (error) {
				logger.error("❌ Error during reset:", error);
			}
		}
	}, []);

	return (
		<AppContext.Provider
			value={{
				stats,
				todayData: rawTodayData,
				currentService,
				setCurrentService,
				currentServiceStats,
				isRequestActive,
				viewMode,
				config,
				updateConfig,
				toastEnabled: config.toastEnabled,
				onToastToggle,
				onReset,
				loading: finalLoading,
				error: finalError,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
