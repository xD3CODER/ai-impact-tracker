import { type EasingFunctions, easingFunctions } from "@/utils/ui/animations";
import { logger } from "@/utils/core/logger";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { css } from "styled-system/css";

interface AnimatedCounterProps {
	value: number;
	formatter: (value: number) => string;
	transitionDuration?: number;
	easingType?: EasingFunctions;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
	value,
	formatter,
	transitionDuration = 800,
	easingType = "easeOut",
}) => {
	const [displayValue, setDisplayValue] = useState(value);
	const animationRef = useRef<number | null>(null);
	const lastValueRef = useRef(value);
	const startTimeRef = useRef<number | null>(null);

	useEffect(() => {
		// Animate if value has changed OR if animation parameters have changed
		const shouldAnimate =
			lastValueRef.current !== value || animationRef.current !== null; // Force restart if an animation is in progress

		if (shouldAnimate) {
			const startValue = animationRef.current
				? displayValue
				: lastValueRef.current;

			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
				animationRef.current = null;
			}

			const endValue = value;
			const totalDifference = Math.abs(endValue - startValue);

			// If difference is very small, no animation
			if (totalDifference < 0.01) {
				setDisplayValue(endValue);
				lastValueRef.current = value;
				return;
			}

			logger.log("🎯 Animation:", {
				from: startValue,
				to: endValue,
				diff: totalDifference,
				duration: transitionDuration,
				easing: easingType,
			});

			const easingFunction = easingFunctions[easingType];

			startTimeRef.current = null;

			const animate = (timestamp: number) => {
				if (startTimeRef.current === null) {
					startTimeRef.current = timestamp;
				}

				const elapsed = timestamp - startTimeRef.current;
				const progress = Math.min(elapsed / transitionDuration, 1);

				if (progress >= 1) {
					setDisplayValue(endValue);
					animationRef.current = null;
					lastValueRef.current = value;
				} else {
					const easedProgress = easingFunction(progress);
					const currentValue =
						startValue + (endValue - startValue) * easedProgress;
					setDisplayValue(currentValue);

					animationRef.current = requestAnimationFrame(animate);
				}
			};

			animationRef.current = requestAnimationFrame(animate);
			lastValueRef.current = value;
		}
	}, [value, transitionDuration, easingType]);

	useEffect(() => {
		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, []);

	return (
		<span
			className={css({
				color: "primary.500",
				display: "inline-block",
				minWidth: "32px",
				fontSize: "sm",
				fontFamily: "numeric",
				textAlign: "center",
			})}
		>
			{formatter(displayValue)}
		</span>
	);
};

export default AnimatedCounter;
