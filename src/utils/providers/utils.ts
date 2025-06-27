// src/utils/provider-utils.ts - Utilities for providers
import type { ImpactValue, Provider } from "@/types/provider";
import { isAdaptiveImpact } from "../calculations/impact";

/**
 * Extracts minimum value from an impact (fixed or adaptive)
 */
export function getMinImpactValue(impactValue: ImpactValue): number {
	if (isAdaptiveImpact(impactValue)) {
		return impactValue.min;
	}
	return impactValue;
}

/**
 * Extracts minimum values from a provider for loading animation
 */
export function getProviderMinValues(provider: Provider): {
	carbon: number;
	water: number;
} {
	return {
		carbon: getMinImpactValue(provider.metrics.carbon),
		water: getMinImpactValue(provider.metrics.water),
	};
}
