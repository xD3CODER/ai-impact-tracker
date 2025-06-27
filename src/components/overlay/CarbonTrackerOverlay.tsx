import FloatingDropdown from "@/components/overlay/FloatingDropdown";
import type { Provider } from "@/types/provider";
import { getProviderByHostname } from "@/utils/providers/detection";
// useServiceStats removed - using Context only
import { ReactiveStorage } from "@/utils/storage/reactive";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { browser } from "wxt/browser";

import { AppContextProvider, useAppContext } from "@/context/AppContext";

type CarbonTrackerOverlayProps = Record<string, never>;

// Composant interne qui utilise le Context
const OverlayContent: React.FC = () => {
	const [currentProvider, setCurrentProvider] = useState<Provider | null>(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const { toastEnabled } = useAppContext();

	useEffect(() => {
		const hostname = window.location.hostname;
		const provider = getProviderByHostname(hostname);
		setCurrentProvider(provider || null);

		// Gestion des listeners de nettoyage
		const handlePageUnload = () => {
			ReactiveStorage.clearAllActiveRequests().catch(() => {});
		};
		const handleVisibilityChange = () => {
			if (document.hidden) {
				ReactiveStorage.clearAllActiveRequests().catch(() => {});
			}
		};
		window.addEventListener("beforeunload", handlePageUnload);
		window.addEventListener("pagehide", handlePageUnload);
		document.addEventListener("visibilitychange", handleVisibilityChange);
		ReactiveStorage.cleanupActiveRequests().catch(() => {});
		return () => {
			window.removeEventListener("beforeunload", handlePageUnload);
			window.removeEventListener("pagehide", handlePageUnload);
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, []);

	const handleToggleDropdown = useCallback(() => {
		setIsDropdownOpen((open) => !open);
	}, []);

	const handleOpenGlobal = useCallback(() => {
		if (browser.runtime.getManifest()) {
			// Send message to open popup
			browser.runtime.sendMessage({ type: "OPEN_POPUP" }).catch(() => {});
		}
	}, []);

	if (!currentProvider || !toastEnabled) return null;

	return (
		<FloatingDropdown
			provider={currentProvider}
			isOpen={isDropdownOpen}
			onToggle={handleToggleDropdown}
			onOpenGlobal={handleOpenGlobal}
		/>
	);
};

const CarbonTrackerOverlay: React.FC<CarbonTrackerOverlayProps> = () => {
	// Determine current service early, before rendering Provider
	const hostname = window.location.hostname;
	const provider = getProviderByHostname(hostname);
	const serviceName = provider?.name || "";

	return (
		<AppContextProvider viewMode="daily" defaultCurrentService={serviceName}>
			<OverlayContent />
		</AppContextProvider>
	);
};

export default CarbonTrackerOverlay;
