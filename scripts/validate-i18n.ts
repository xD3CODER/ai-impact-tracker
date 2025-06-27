#!/usr/bin/env tsx

import { readFileSync } from "node:fs";
import { join } from "node:path";

interface EquivalenceEntry {
	[threshold: string]: string[];
}

interface LocaleData {
	[key: string]: string | EquivalenceEntry | undefined;
	equivalencesCarbon?: EquivalenceEntry;
	equivalencesWater?: EquivalenceEntry;
}

interface ValidationResult {
	success: boolean;
	errors: string[];
	warnings: string[];
	stats: {
		totalKeys: number;
		carbonEquivalences: { [threshold: string]: number };
		waterEquivalences: { [threshold: string]: number };
	};
}

class I18nValidator {
	private enData: LocaleData;
	private frData: LocaleData;

	constructor() {
		try {
			this.enData = JSON.parse(
				readFileSync(join(process.cwd(), "src/locales/en.json"), "utf8"),
			);
			this.frData = JSON.parse(
				readFileSync(join(process.cwd(), "src/locales/fr.json"), "utf8"),
			);
		} catch (error) {
			throw new Error(`Error loading locale files: ${error}`);
		}
	}

	validate(): ValidationResult {
		const result: ValidationResult = {
			success: true,
			errors: [],
			warnings: [],
			stats: {
				totalKeys: 0,
				carbonEquivalences: {},
				waterEquivalences: {},
			},
		};

		// Check that main keys exist
		this.validateMainKeys(result);

		// Check carbon equivalences
		this.validateCarbonEquivalences(result);

		// Check water equivalences
		this.validateWaterEquivalences(result);

		// Check key consistency between EN and FR
		this.validateKeyConsistency(result);

		// Calculate statistics
		this.calculateStats(result);

		result.success = result.errors.length === 0;
		return result;
	}

	private validateMainKeys(result: ValidationResult): void {
		// Check that main structures exist
		if (!this.enData.equivalencesCarbon) {
			result.errors.push("Structure equivalencesCarbon missing in English");
		}
		if (!this.frData.equivalencesCarbon) {
			result.errors.push("Structure equivalencesCarbon missing in French");
		}
		if (!this.enData.equivalencesWater) {
			result.errors.push("Structure equivalencesWater missing in English");
		}
		if (!this.frData.equivalencesWater) {
			result.errors.push("Structure equivalencesWater missing in French");
		}
	}

	private validateCarbonEquivalences(result: ValidationResult): void {
		const enCarbon = this.extractEquivalenceThresholds(
			this.enData,
			"equivalencesCarbon",
		);
		const frCarbon = this.extractEquivalenceThresholds(
			this.frData,
			"equivalencesCarbon",
		);

		this.compareEquivalenceStructures("Carbon", enCarbon, frCarbon, result);
		result.stats.carbonEquivalences =
			this.countEquivalencesByThreshold(enCarbon);
	}

	private validateWaterEquivalences(result: ValidationResult): void {
		const enWater = this.extractEquivalenceThresholds(
			this.enData,
			"equivalencesWater",
		);
		const frWater = this.extractEquivalenceThresholds(
			this.frData,
			"equivalencesWater",
		);

		this.compareEquivalenceStructures("Water", enWater, frWater, result);
		result.stats.waterEquivalences = this.countEquivalencesByThreshold(enWater);
	}

	private extractEquivalenceThresholds(
		data: LocaleData,
		type: string,
	): EquivalenceEntry {
		const equivalences = data[type];
		return equivalences && typeof equivalences === "object"
			? (equivalences as EquivalenceEntry)
			: {};
	}

	private compareEquivalenceStructures(
		type: string,
		enData: EquivalenceEntry,
		frData: EquivalenceEntry,
		result: ValidationResult,
	): void {
		const enThresholds = Object.keys(enData).sort();
		const frThresholds = Object.keys(frData).sort();

		// Check that each EN threshold has its FR correspondence
		for (const threshold of enThresholds) {
			if (!frThresholds.includes(threshold)) {
				result.errors.push(`Threshold ${type} missing in French: ${threshold}`);
				continue;
			}

			const enArray = enData[threshold];
			const frArray = frData[threshold];

			// Check that arrays exist and have the same length
			if (!Array.isArray(enArray) || !Array.isArray(frArray)) {
				result.errors.push(
					`Invalid structure for ${type} threshold ${threshold}`,
				);
				continue;
			}

			if (enArray.length !== frArray.length) {
				result.errors.push(
					`Different number of equivalences for ${type} threshold ${threshold}: EN=${enArray.length}, FR=${frArray.length}`,
				);
			}

			// Check that contents are not empty
			for (let i = 0; i < enArray.length; i++) {
				if (
					!enArray[i] ||
					typeof enArray[i] !== "string" ||
					enArray[i].trim() === ""
				) {
					result.errors.push(
						`Empty content in English for: ${type} ${threshold}[${i}]`,
					);
				}
			}

			for (let i = 0; i < frArray.length; i++) {
				if (
					!frArray[i] ||
					typeof frArray[i] !== "string" ||
					frArray[i].trim() === ""
				) {
					result.errors.push(
						`Empty content in French for: ${type} ${threshold}[${i}]`,
					);
				}
			}
		}

		// Check that each FR threshold has its EN correspondence
		for (const threshold of frThresholds) {
			if (!enThresholds.includes(threshold)) {
				result.errors.push(
					`Threshold ${type} missing in English: ${threshold}`,
				);
			}
		}
	}

	private validateKeyConsistency(result: ValidationResult): void {
		const enKeys = new Set(Object.keys(this.enData));
		const frKeys = new Set(Object.keys(this.frData));

		// Keys present in EN but not in FR
		for (const key of enKeys) {
			if (!frKeys.has(key)) {
				result.warnings.push(
					`Key present in English but not in French: ${key}`,
				);
			}
		}

		// Keys present in FR but not in EN
		for (const key of frKeys) {
			if (!enKeys.has(key)) {
				result.warnings.push(
					`Key present in French but not in English: ${key}`,
				);
			}
		}
	}

	private countEquivalencesByThreshold(data: { [threshold: string]: any[] }): {
		[threshold: string]: number;
	} {
		const counts: { [threshold: string]: number } = {};

		for (const [threshold, array] of Object.entries(data)) {
			counts[threshold] = Array.isArray(array) ? array.length : 0;
		}

		return counts;
	}

	private calculateStats(result: ValidationResult): void {
		result.stats.totalKeys = Object.keys(this.enData).length;
	}
}

function main(): void {
	console.log("🌐 Starting i18n validation...\n");

	try {
		const validator = new I18nValidator();
		const result = validator.validate();

		console.log("📊 Validation Statistics:");
		console.log(`   Total keys: ${result.stats.totalKeys}`);
		console.log(
			`   Missing keys: ${result.errors.filter((e) => e.includes("Missing")).length}`,
		);
		console.log(
			`   Format errors: ${result.errors.filter((e) => e.includes("Format")).length}\n`,
		);

		if (result.warnings.length > 0) {
			console.log("⚠️  Warnings:");
			for (const warning of result.warnings) {
				console.log(`   ${warning}`);
			}
			console.log("");
		}

		if (result.errors.length > 0) {
			console.log("❌ Errors found:");
			for (const error of result.errors) {
				console.log(`   ${error}`);
			}
			console.log("");
			process.exit(1);
		}

		console.log("✅ i18n validation passed!");
	} catch (error) {
		console.error("❌ Validation failed:", error);
		process.exit(1);
	}
}

main();
