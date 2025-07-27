// src/utils/reactive-storage.ts - Reactive storage with detailed logs
import type {
	AIRequest,
	DailyCarbonData,
	TotalFootprint,
} from "@/types/carbon";
import { browser } from "wxt/browser";
import { logger } from "@/utils/core/logger";

logger.log("🔧 reactive-storage.ts loaded");

/**
 * Simple reactive storage system with multi-tab synchronization
 */
export class ReactiveStorage {
	private static listeners: Array<() => void> = [];
	private static isInitialized = false;
	private static cleanupIntervalId: number | null = null;
	private static instance: ReactiveStorage | null = null;

	/**
	 * Get singleton instance
	 */
	static getInstance(): ReactiveStorage {
		if (!ReactiveStorage.instance) {
			ReactiveStorage.instance = new ReactiveStorage();
			ReactiveStorage.init();
		}
		return ReactiveStorage.instance;
	}

	/**
	 * Subscribe to storage changes
	 */
	static subscribe(listener: () => void): () => void {
		ReactiveStorage.listeners.push(listener);
		return () => {
			const index = ReactiveStorage.listeners.indexOf(listener);
			if (index > -1) {
				ReactiveStorage.listeners.splice(index, 1);
			}
		};
	}

	/**
	 * Check if the extension context is valid
	 */
	private static isContextValid(): boolean {
		try {
			// Simple check with WXT's browser API
			return !!browser.runtime.getManifest();
		} catch {
			return false;
		}
	}

	/**
	 * Initialize the system (once only)
	 */
	static init(): void {
		if (ReactiveStorage.isInitialized) {
			logger.log("🔧 Reactive storage already initialized");
			return;
		}

		logger.log("🚀 Initializing reactive storage...");

		// Listen for storage changes
		if (browser?.storage?.local?.onChanged) {
			try {
				browser.storage.local.onChanged.addListener((changes) => {
					logger.log("📡 Storage change detected:", Object.keys(changes));
					ReactiveStorage.notifyListeners();
				});
				logger.log("✅ Storage listener configured");
			} catch (_error) {
				logger.log("⚠️ Error configuring storage listener");
			}
		} else {
			logger.log("⚠️ browser.storage not available");
		}

		// Configure automatic cleanup every 10 minutes
		ReactiveStorage.startAutoCleanup();

		ReactiveStorage.isInitialized = true;
		logger.log("✅ Reactive storage initialized");
	}

	/**
	 * Notify all listeners
	 */
	private static notifyListeners() {
		logger.log(
			`📢 Notification of ${ReactiveStorage.listeners.length} listeners`,
		);
		ReactiveStorage.listeners.forEach((listener) => {
			try {
				listener();
			} catch (error) {
				logger.log("⚠️ Error in listener:", error);
			}
		});
	}

	/**
	 * Record an AI request
	 */
	static async recordAIRequest(request: AIRequest): Promise<void> {
		logger.log("📝 Recording request:", {
			service: request.service,
			carbon: request.carbonImpact,
			water: request.waterImpact,
		});

		if (!ReactiveStorage.isContextValid()) {
			return;
		}

		try {
			const todayKey = ReactiveStorage.getTodayKey();
			const result = await browser.storage.local.get([todayKey, "globalStats"]);
			logger.log("📊 Current data retrieved:", result);

			const todayData = result[todayKey] || {
				totalCarbon: 0,
				totalWater: 0,
				requests: 0,
				totalDuration: 0,
				services: {},
			};

			todayData.totalCarbon += request.carbonImpact;
			todayData.totalWater += request.waterImpact;
			todayData.requests += 1;
			todayData.totalDuration += request.duration || 0;

			if (!todayData.services[request.service]) {
				todayData.services[request.service] = {
					requests: 0,
					carbon: 0,
					water: 0,
					totalDuration: 0,
				};
			}

			const serviceData = todayData.services[request.service];
			serviceData.requests += 1;
			serviceData.carbon += request.carbonImpact;
			serviceData.water += request.waterImpact;
			serviceData.totalDuration += request.duration || 0;

			const globalStats = result.globalStats || {
				requests: 0,
				carbon: 0,
				water: 0,
				totalDuration: 0,
				services: {},
			};

			globalStats.requests += 1;
			globalStats.carbon += request.carbonImpact;
			globalStats.water += request.waterImpact;
			globalStats.totalDuration += request.duration || 0;

			if (!globalStats.services[request.service]) {
				globalStats.services[request.service] = {
					requests: 0,
					carbon: 0,
					water: 0,
					totalDuration: 0,
				};
			}

			globalStats.services[request.service].requests += 1;
			globalStats.services[request.service].carbon += request.carbonImpact;
			globalStats.services[request.service].water += request.waterImpact;
			globalStats.services[request.service].totalDuration +=
				request.duration || 0;

			await browser.storage.local.set({
				[todayKey]: todayData,
				globalStats: globalStats,
			});

			logger.log("✅ Request recorded:", {
				todayData,
				globalStats,
			});

			ReactiveStorage.notifyListeners();
		} catch (error) {
			logger.log("⚠️ Error recording request:", error);
		}
	}

	/**
	 * Get today's data
	 */
	static async getTodayData(): Promise<DailyCarbonData> {
		logger.log("📖 Getting today's data...");

		const defaultData: DailyCarbonData = {
			totalCarbon: 0,
			totalWater: 0,
			requests: 0,
			totalDuration: 0,
			services: {},
		};

		if (!ReactiveStorage.isContextValid()) {
			return defaultData;
		}

		try {
			const todayKey = ReactiveStorage.getTodayKey();
			const result = await browser.storage.local.get([todayKey]);
			const data = result[todayKey] || defaultData;

			logger.log("📖 Today's data retrieved:", data);
			return data;
		} catch (error) {
			logger.log("⚠️ Error retrieving today's data:", error);
			return defaultData;
		}
	}

	/**
	 * Get global stats
	 */
	static async getGlobalStats(): Promise<TotalFootprint> {
		logger.log("📊 Getting global stats...");

		const defaultStats = {
			requests: 0,
			carbon: 0,
			water: 0,
			totalDuration: 0,
			services: {},
		};

		if (!ReactiveStorage.isContextValid()) {
			return defaultStats;
		}

		try {
			const result = await browser.storage.local.get(["globalStats"]);
			const stats = result.globalStats || defaultStats;

			logger.log("📖 Global stats retrieved:", stats);
			return stats;
		} catch (error) {
			logger.log("⚠️ Error retrieving global stats:", error);
			return defaultStats;
		}
	}

	/**
	 * Get service stats
	 */
	static async getServiceStats(serviceName: string): Promise<DailyCarbonData> {
		logger.log("📖 Getting service stats:", serviceName);

		const defaultServiceData: DailyCarbonData = {
			totalCarbon: 0,
			totalWater: 0,
			requests: 0,
			totalDuration: 0,
			services: {},
		};

		if (!ReactiveStorage.isContextValid()) {
			logger.log("📖 No data for service:", serviceName);
			return defaultServiceData;
		}

		const todayData = await ReactiveStorage.getTodayData();
		const serviceStats = todayData.services[serviceName];

		if (!serviceStats) {
			logger.log("📖 No service data found for:", serviceName);
			return defaultServiceData;
		}

		// Convert ServiceStats to DailyCarbonData format
		const serviceData: DailyCarbonData = {
			totalCarbon: serviceStats.carbon,
			totalWater: serviceStats.water,
			requests: serviceStats.requests,
			totalDuration: serviceStats.totalDuration,
			services: { [serviceName]: serviceStats },
		};

		logger.log("📖 Service stats retrieved:", serviceData);
		return serviceData;
	}

	/**
	 * Clear all extension data
	 */
	static async clearAllData(): Promise<void> {
		logger.log("🗑️ Clearing all data...");

		if (!ReactiveStorage.isContextValid()) {
			return;
		}

		try {
			const allData = await browser.storage.local.get();
			const keysToDelete: string[] = [];

			for (const key of Object.keys(allData)) {
				if (key.startsWith("carbonData_") || key === "globalStats") {
					keysToDelete.push(key);
				}
			}

			logger.log("🗑️ Keys to delete:", keysToDelete);

			if (keysToDelete.length > 0) {
				await browser.storage.local.remove(keysToDelete);
			}

			logger.log("✅ All data has been cleared");

			ReactiveStorage.notifyListeners();
		} catch (error) {
			console.error("❌ Error clearing data:", error);
		}
	}

	/**
	 * Key for today's data
	 */
	private static getTodayKey(): string {
		const today = new Date().toISOString().split("T")[0];
		const key = `carbonData_${today}`;
		logger.log("🗓️ Today's key:", key);
		return key;
	}

	/**
	 * Mark the start of an ongoing request
	 */
	static async markRequestStart(
		serviceName: string,
		requestId: string,
	): Promise<void> {
		logger.log("🚀 Request start:", { service: serviceName, requestId });

		if (!ReactiveStorage.isContextValid()) {
			return;
		}

		try {
			// Get current active requests
			const result = await browser.storage.local.get(["activeRequests"]);
			const activeRequests = result.activeRequests || {};

			// Add/update this service's request
			activeRequests[serviceName] = {
				requestId,
				startTime: Date.now(),
				isActive: true,
			};

			await browser.storage.local.set({ activeRequests });
			logger.log("✅ Request marked as active:", serviceName);
		} catch (error) {
			console.error("❌ Error marking request start:", error);
		}
	}

	/**
	 * Mark the end of an ongoing request
	 */
	static async markRequestEnd(
		serviceName: string,
		requestId: string,
	): Promise<void> {
		logger.log("🏁 Request end:", { service: serviceName, requestId });

		if (!ReactiveStorage.isContextValid()) {
			return;
		}

		try {
			const result = await browser.storage.local.get(["activeRequests"]);
			const activeRequests = result.activeRequests || {};
			const activeRequest = activeRequests[serviceName];

			if (activeRequest && activeRequest.requestId === requestId) {
				delete activeRequests[serviceName];
				await browser.storage.local.set({ activeRequests });
				logger.log("✅ Request marked as completed:", serviceName);
			} else {
				logger.log("⚠️ RequestId does not match, request already completed");
			}
		} catch (error) {
			console.error("❌ Error marking request end:", error);
		}
	}

	/**
	 * Check if a request is ongoing for a service
	 */
	static async isRequestActive(serviceName: string): Promise<boolean> {
		if (!ReactiveStorage.isContextValid()) {
			return false;
		}

		try {
			const result = await browser.storage.local.get(["activeRequests"]);
			const activeRequests = result.activeRequests || {};
			const isActive = !!activeRequests[serviceName]?.isActive;

			logger.log("🔍 Checking active request:", {
				service: serviceName,
				isActive,
				timestamp: Date.now(),
			});

			return isActive;
		} catch (error) {
			console.error("❌ Error checking active request:", error);
			return false;
		}
	}

	/**
	 * Get all active requests
	 */
	static async getAllActiveRequests(): Promise<
		Record<string, { requestId: string; startTime: number; isActive: boolean }>
	> {
		if (!ReactiveStorage.isContextValid()) {
			return {};
		}

		try {
			const result = await browser.storage.local.get(["activeRequests"]);
			return result.activeRequests || {};
		} catch (error) {
			console.error("❌ Error getting active requests:", error);
			return {};
		}
	}

	/**
	 * Clean up orphaned or too old active requests
	 */
	static async cleanupActiveRequests(): Promise<void> {
		logger.log("🧹 Cleaning up active requests...");

		if (!ReactiveStorage.isContextValid()) {
			return;
		}

		try {
			const result = await browser.storage.local.get(["activeRequests"]);
			const activeRequests = result.activeRequests || {};

			const now = Date.now();
			const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes timeout
			let cleaned = false;

			// Clean up expired requests
			for (const [serviceName, requestData] of Object.entries(activeRequests)) {
				const typedRequestData = requestData as {
					requestId: string;
					startTime: number;
					isActive: boolean;
				};
				const age = now - typedRequestData.startTime;

				if (age > TIMEOUT_MS) {
					logger.log(
						`🧹 Cleaning up expired request: ${serviceName} (${Math.round(age / 1000)}s)`,
					);
					delete activeRequests[serviceName];
					cleaned = true;
				}
			}

			if (cleaned) {
				await browser.storage.local.set({ activeRequests });
				ReactiveStorage.notifyListeners();
				logger.log("✅ Expired requests cleaned up");
			} else {
				logger.log("✅ No requests to clean up");
			}
		} catch (error) {
			console.error("❌ Error cleaning up active requests:", error);
		}
	}

	/**
	 * Clean up all active requests (on page change)
	 */
	static async clearAllActiveRequests(): Promise<void> {
		logger.log("🧹 Complete cleanup of active requests...");

		if (!ReactiveStorage.isContextValid()) {
			return;
		}

		try {
			await browser.storage.local.set({ activeRequests: {} });
			ReactiveStorage.notifyListeners();
			logger.log("✅ All active requests cleaned up");
		} catch (error) {
			console.error("❌ Error clearing all active requests:", error);
		}
	}

	/**
	 * Initialize automatic cleanup
	 */
	private static startAutoCleanup(): void {
		if (ReactiveStorage.cleanupIntervalId !== null) {
			return;
		}

		ReactiveStorage.cleanupIntervalId = setInterval(
			() => {
				ReactiveStorage.cleanupActiveRequests().catch(() => {
					// Silent error handling
				});
			},
			10 * 60 * 1000, // Every 10 minutes
		) as unknown as number;

		logger.log("✅ Automatic cleanup configured");
	}

	/**
	 * Stop automatic cleanup
	 */
	static stopCleanup(): void {
		if (ReactiveStorage.cleanupIntervalId !== null) {
			clearInterval(ReactiveStorage.cleanupIntervalId);
			ReactiveStorage.cleanupIntervalId = null;
			logger.log("🛑 Automatic cleanup stopped");
		}
	}
}

// Initialize automatically
ReactiveStorage.init();
