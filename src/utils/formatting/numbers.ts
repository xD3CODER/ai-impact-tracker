// src/utils/formatting/numbers.ts - Number formatting utilities
import { safeNumber } from "@/utils/core/validators";
/**
 * Formats carbon grams count
 */
export function formatCarbon(carbonGrams: number): string {
	const safeGrams = safeNumber(carbonGrams, 0);

	if (safeGrams < 0.001) {
		return `${Math.round(safeGrams * 1000000)}μg`;
	}
	if (safeGrams < 1) {
		return `${Math.round(safeGrams * 1000)}mg`;
	}
	if (safeGrams < 100) {
		return `${safeGrams.toFixed(2)}g`;
	}
	return `${Math.round(safeGrams)}g`;
}

/**
 * Formats water volume in milliliters
 */
export function formatWater(waterMl: number): string {
	const safeMl = safeNumber(waterMl, 0);

	if (safeMl < 1000) {
		return `${Math.round(safeMl)}ml`;
	}
	return `${(safeMl / 1000).toFixed(2)}L`;
}
