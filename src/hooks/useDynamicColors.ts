// src/hooks/useDynamicColors.ts - Hook for dynamic colors based on impact

import { DynamicColorManager } from "@/utils/ui/colors";
import { useMemo } from "react";

/**
 * Hook to get dynamic colors based on carbon and water impact
 */
export function useDynamicColors(carbonGrams: number, waterMl: number) {
	return useMemo(() => {
		return DynamicColorManager.generateDynamicStyles(carbonGrams, waterMl);
	}, [carbonGrams, waterMl]);
}
