import { logger } from "@/utils/core/logger";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import AnimatedCounter from "./AnimatedCounter";

export interface AnimatedLoadingCounterProps {
	/** The real value to display */
	realValue: number;
	/** If a request/loading is in progress */
	isLoading: boolean;
	/** Minimum value for incrementation during loading */
	minValueForLoading?: number;
	/** Function to format display */
	formatValue?: (value: number) => string;
}

/**
 * Component that handles animation towards a target value
 * with variable animation speed according to loading state
 */
const AnimatedLoadingCounter: React.FC<AnimatedLoadingCounterProps> = ({
	realValue,
	isLoading,
	minValueForLoading,
	formatValue,
}) => {
	const [targetValue, setTargetValue] = useState(realValue);
	const [animationDuration, setAnimationDuration] = useState(800); // ms
	const [animationEasing, setAnimationEasing] = useState<
		"easeOutExpo" | "easeOutCirc"
	>("easeOutExpo");

	const initialValueRef = useRef<number | null>(null);
	const wasLoadingRef = useRef<boolean>(false);

	// Log for debugging
	logger.log("🎨 AnimatedLoadingCounter render:", {
		realValue,
		isLoading,
		minValueForLoading,
		targetValue,
		animationDuration,
		animationEasing,
		initialValueRef: initialValueRef.current,
	});

	useEffect(() => {
		// At the start of loading
		if (isLoading && !wasLoadingRef.current) {
			logger.log(
				"🚀 AnimatedLoadingCounter - loading start, initial value:",
				realValue,
			);

			// Remember initial value
			initialValueRef.current = realValue;

			// Calculate estimated value and round to 2 decimals to ensure difference
			const rawEstimatedValue = realValue + (minValueForLoading || 0);
			const estimatedValue = Math.round(rawEstimatedValue * 100) / 100;
			setTargetValue(estimatedValue);

			// Set very slow animation speed (30 seconds = 30000ms)
			// This duration must be long enough so animation doesn't complete
			// before the true value arrives
			setAnimationDuration(20000);

			// Use initialBurst curve for loading - fast start then constant speed
			setAnimationEasing("easeOutCirc");

			logger.log("🚀 Increment animation configured:", {
				from: realValue,
				to: estimatedValue,
				minValueForLoading,
				rawEstimatedValue,
				duration: "20000ms",
				easing: "easeOutCirc",
			});
		}
		// At loading end
		if (!isLoading && wasLoadingRef.current) {
			logger.log(
				"✅ AnimatedLoadingCounter - loading end, true value:",
				realValue,
			);

			// Set target value to final real value
			setTargetValue(realValue);

			// Speed up animation to quickly reach final value
			setAnimationDuration(1000);

			// Use easeOut classic curve for finalization
			setAnimationEasing("easeOutExpo");

			logger.log("🚀 Fast animation configured:", {
				to: realValue,
				duration: "1000ms",
				easing: "easeOutExpo",
			});

			// Reset initial state
			initialValueRef.current = null;
		}

		wasLoadingRef.current = isLoading;
	}, [isLoading, minValueForLoading, realValue]);

	// Separate effect to handle only realValue updates without changing isLoading state
	useEffect(() => {
		if (!isLoading) {
			setTargetValue(realValue);
		}
	}, [realValue, isLoading]);

	return (
		<AnimatedCounter
			value={targetValue}
			formatter={formatValue || ((value) => value.toString())}
			transitionDuration={animationDuration}
			easingType={animationEasing}
		/>
	);
};

export default AnimatedLoadingCounter;
