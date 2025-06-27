import { useAppContext, useIsRequestActive } from "@/context/AppContext";
import { useDynamicColors } from "@/hooks/useDynamicColors";
import type { Provider } from "@/types/provider";
import { getProviderMinValues } from "@/utils/providers/utils";
import { logger } from "@/utils/core/logger";
import React, { useState, useEffect, useRef } from "react";

interface DropdownState {
	shouldRender: boolean;
	isAnimating: boolean;
	isHidden: boolean;
	showCloseButton: boolean;
}

interface OverlayState {
	isOverlayHidden: boolean;
	showCloseButton: boolean;
}

export function useFloatingDropdownData(provider: Provider, isOpen: boolean) {
	const { currentServiceStats: serviceStats } = useAppContext();

	const [dropdownState, setDropdownState] = useState<DropdownState>({
		shouldRender: false,
		isAnimating: false,
		isHidden: false,
		showCloseButton: false,
	});

	const [overlayState, setOverlayState] = useState<OverlayState>({
		isOverlayHidden: false,
		showCloseButton: false,
	});

	const timerRef = useRef<number | null>(null);

	const isRequestActive = useIsRequestActive(provider.name);

	logger.log("🔍 FloatingDropdown - isRequestActive:", {
		value: isRequestActive,
		type: typeof isRequestActive,
		provider: provider.name,
	});

	const providerMinValues = React.useMemo(() => {
		try {
			return getProviderMinValues(provider);
		} catch (error) {
			console.error("Error getting provider min values:", error);
			return { carbon: 0, water: 0 };
		}
	}, [provider]);

	useEffect(() => {
		if (isOpen) {
			setDropdownState({
				shouldRender: true,
				isAnimating: true,
				isHidden: false,
				showCloseButton: false,
			});
		} else {
			setDropdownState((prev) => ({
				...prev,
				isAnimating: false,
			}));
			setTimeout(() => {
				setDropdownState((prev) => ({
					...prev,
					shouldRender: false,
				}));
			}, 300);
		}
	}, [isOpen]);

	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, []);

	const dynamicColors = useDynamicColors(
		serviceStats.carbon,
		serviceStats.water,
	);

	const handleContainerClick = () => {
		if (overlayState.isOverlayHidden) {
			setOverlayState((prev) => ({
				...prev,
				isOverlayHidden: false,
				showCloseButton: false,
			}));

			timerRef.current = window.setTimeout(() => {
				setOverlayState((prev) => ({ ...prev, showCloseButton: true }));
			}, 2000);
		} else {
			setOverlayState((prev) => ({
				...prev,
				isOverlayHidden: true,
				showCloseButton: false,
			}));

			if (timerRef.current) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}
		}
	};

	const handleContainerHover = (isEntering: boolean) => {
		if (overlayState.isOverlayHidden) return;

		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}

		if (isEntering) {
			timerRef.current = window.setTimeout(() => {
				setOverlayState((prev) => ({ ...prev, showCloseButton: true }));
			}, 1000);
		} else {
			setOverlayState((prev) => ({ ...prev, showCloseButton: false }));
		}
	};

	return {
		dropdownState: {
			...dropdownState,
			isHidden: overlayState.isOverlayHidden,
			showCloseButton: overlayState.showCloseButton,
		},
		isRequestActive,
		serviceStats,
		dynamicColors,
		providerMinValues,
		handleContainerClick,
		handleContainerHover,
	};
}
