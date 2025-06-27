// src/utils/core/validators.ts - Common validation utilities

/**
 * Validates and cleans a numeric value
 */
export function safeNumber(value: any, defaultValue = 0): number {
	if (value === null || value === undefined) return defaultValue;
	const num = Number(value);
	return Number.isNaN(num) || !Number.isFinite(num) ? defaultValue : num;
}
