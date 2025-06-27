// src/utils/calculations/impact.ts - Adaptive impact calculation based on duration
import type {
	AdaptiveImpact,
	DurationThresholds,
	ImpactValue,
} from "@/types/provider";
import { logger } from "@/utils/core/logger";

const DEFAULT_THRESHOLDS: DurationThresholds = {
	simple: 2, // < 2s = simple request
	complex: 15, // > 15s = complex request
};

// Types de fonctions d'interpolation
export type InterpolationFunction =
	| "linear"
	| "exponential"
	| "logarithmic"
	| "sigmoid";

/**
 * Checks if an impact value is adaptive
 */
export function isAdaptiveImpact(value: ImpactValue): value is AdaptiveImpact {
	return (
		typeof value === "object" &&
		value !== null &&
		"min" in value &&
		"max" in value
	);
}

/**
 * Calculates adaptive impact based on request duration
 * @param impactValue - Impact value (fixed or adaptive)
 * @param durationMs - Request duration in milliseconds
 * @param thresholds - Duration thresholds (optional, uses defaults otherwise)
 * @param interpolationType - Type of interpolation to use
 * @returns Calculated impact
 */
export function calculateAdaptiveImpact(
	impactValue: AdaptiveImpact | number,
	durationMs: number,
	thresholds: typeof DEFAULT_THRESHOLDS = DEFAULT_THRESHOLDS,
	interpolationType: InterpolationFunction = "linear",
): number {
	// If it's a fixed value, return it directly
	if (typeof impactValue === "number") {
		return impactValue;
	}

	const durationSeconds = durationMs / 1000;
	const { min, max } = impactValue;

	logger.info(
		`🧮 Calcul impact adaptatif: ${durationSeconds}s, min=${min}, max=${max}`,
	);

	// If duration is less than simple threshold, return minimum impact
	if (durationSeconds <= thresholds.simple) {
		logger.info(
			`⚡ Simple request (${durationSeconds}s ≤ ${thresholds.simple}s) → min impact: ${min}`,
		);
		return min;
	}

	// If duration is greater than complex threshold, return maximum impact
	if (durationSeconds >= thresholds.complex) {
		logger.info(
			`🔥 Complex request (${durationSeconds}s ≥ ${thresholds.complex}s) → max impact: ${max}`,
		);
		return max;
	}

	// Calculate interpolation factor (0 to 1)
	const t =
		(durationSeconds - thresholds.simple) /
		(thresholds.complex - thresholds.simple);

	// Apply the chosen interpolation
	const interpolatedValue = interpolate(t, min, max, interpolationType);

	logger.info(
		`📈 Interpolation ${interpolationType}: ${durationSeconds}s → facteur ${t.toFixed(3)} → impact ${interpolatedValue.toFixed(2)}`,
	);

	return interpolatedValue;
}

/**
 * Interpolation function
 * @param t - Normalized factor between 0 and 1
 * @param min - Minimum value
 * @param max - Maximum value
 * @param type - Interpolation type
 * @returns Interpolated value
 */
function interpolate(
	t: number,
	min: number,
	max: number,
	type: InterpolationFunction,
): number {
	// Ensure t is between 0 and 1
	t = Math.max(0, Math.min(1, t));

	let factor: number;

	switch (type) {
		case "linear":
			// Simple linear interpolation
			factor = t;
			break;

		case "exponential":
			// Exponential growth (impact increases rapidly)
			factor = t ** 2;
			break;

		case "logarithmic":
			// Logarithmic growth (impact increases slowly then rapidly)
			factor = Math.log(1 + t * (Math.E - 1)) / Math.log(Math.E);
			break;

		case "sigmoid": {
			// Sigmoid function (S-curve, more realistic)
			// Transform to get a smooth curve between 0 and 1
			const k = 6; // Controls curve "steepness"
			const sigmoid = 1 / (1 + Math.exp(-k * (t - 0.5)));
			const normalizedSigmoid =
				(sigmoid - 1 / (1 + Math.exp(k * 0.5))) /
				(1 / (1 + Math.exp(-k * 0.5)) - 1 / (1 + Math.exp(k * 0.5)));
			factor = min + (max - min) * normalizedSigmoid;
			break;
		}

		default:
			factor = t;
	}

	return min + (max - min) * factor;
}

/**
 * Utility to easily create an AdaptiveImpact (simplified)
 */
export function createAdaptiveImpact(min: number, max: number): AdaptiveImpact {
	return { min, max };
}

/**
 * Utilities for common adaptive impact patterns (simplified)
 */
export const AdaptivePatterns = {
	// Pattern for light models (GPT-3.5, Claude Haiku)
	light: createAdaptiveImpact(0.8, 3.0),

	// Pattern for medium models (GPT-4, Claude Sonnet)
	middle: createAdaptiveImpact(2.0, 8.0),

	// Pattern for heavy models (GPT-4 Turbo, Claude Opus)
	heavy: createAdaptiveImpact(4.0, 15.0),
};
