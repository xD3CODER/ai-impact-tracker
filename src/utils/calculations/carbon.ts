// src/utils/calculations/carbon.ts - Carbon impact calculations
import type { EquivalenceData } from "@/types/carbon";
import { safeNumber } from "@/utils/core/validators";
import { EquivalenceManager } from "./equivalences";

export class CarbonCalculator {
	/**
	 * Calculates all equivalences with variety
	 */
	static getAllEquivalences(
		carbonGrams: number,
		waterMl: number,
	): EquivalenceData {
		const safeCarbon = safeNumber(carbonGrams, 0);
		const safeWater = safeNumber(waterMl, 0);

		return {
			water: EquivalenceManager.getWaterEquivalence(safeWater),
			carbon: EquivalenceManager.getCarbonEquivalence(safeCarbon),
			combined: `${EquivalenceManager.getWaterEquivalence(safeWater)} + ${EquivalenceManager.getCarbonEquivalence(safeCarbon)}`,
		};
	}

	/**
	 * Generates impact message with concrete equivalences
	 */
	static getImpactMessages(
		carbonGrams: number,
		waterMl: number,
		requests: number,
		serviceName?: string,
	): string[] {
		const safeCarbon = safeNumber(carbonGrams, 0);
		const safeWater = safeNumber(waterMl, 0);
		const safeRequests = safeNumber(requests, 0);

		if (safeRequests === 0) {
			return serviceName
				? [i18n.t("noActivityTodayService", [serviceName])]
				: [i18n.t("noActivityGlobal")];
		}

		const equivalences = CarbonCalculator.getAllEquivalences(
			safeCarbon,
			safeWater,
		);

		// Use the EquivalenceManager message generator
		const messages = EquivalenceManager.getImpactMessages(
			equivalences.water,
			equivalences.carbon,
		);

		return messages;
	}
}
