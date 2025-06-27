// src/utils/formatting/duration.ts - Duration formatting utilities
import { safeNumber } from "@/utils/core/validators";

/**
 * Formats duration in milliseconds to readable format
 * @param durationMs - Duration in milliseconds
 * @returns Formatted string (e.g., "2.5s", "1m 30s", "2h 15m")
 */
export function formatDuration(durationMs: number): string {
	const safeDuration = safeNumber(durationMs, 0);

	if (safeDuration < 1000) {
		return `${Math.round(safeDuration)}ms`;
	}

	const seconds = safeDuration / 1000;

	if (seconds < 60) {
		return `${seconds.toFixed(1)}s`;
	}

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.round(seconds % 60);

	if (minutes < 60) {
		if (remainingSeconds === 0) {
			return `${minutes}m`;
		}
		return `${minutes}m ${remainingSeconds}s`;
	}

	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	if (remainingMinutes === 0) {
		return `${hours}h`;
	}
	return `${hours}h ${remainingMinutes}m`;
}
