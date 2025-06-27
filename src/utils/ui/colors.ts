// src/utils/dynamic-colors.ts - Dynamic color system based on environmental impact
/**
 * Generates dynamic colors based on impact level
 */
import { easingFunctions } from "@/utils/ui/animations.ts";

export class DynamicColorManager {
	/**
	 * Smooth step function for transitions
	 */
	private static smoothStep(edge0: number, edge1: number, x: number): number {
		const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
		return t * t * (3 - 2 * t);
	}
	/**
	 * Calculates impact intensity on a scale from 0 to 1
	 */
	static calculateImpactIntensity(
		carbonGrams: number,
		waterMl: number,
	): number {
		const maxCarbon = 100;
		const maxWater = 1000;

		const carbonRatio = Math.min(carbonGrams / maxCarbon, 1);
		const waterRatio = Math.min(waterMl / maxWater, 1);

		// Weighted average with easing for more natural progression
		const rawIntensity = carbonRatio * 0.7 + waterRatio * 0.3;

		// Apply easing to make the progression more natural
		return Math.min(easingFunctions.easeOutCubic(rawIntensity), 1);
	}

	/**
	 * Generates a color between icy blue, green and red based on intensity
	 * Using pure mathematical functions for smooth continuous transitions
	 */
	static generateImpactColor(intensity: number): {
		borderColor: string;
		borderColorHover: string;
		backgroundColor: string;
		boxShadow: string;
	} {
		const clampedIntensity = Math.max(0, Math.min(1, intensity));

		// Hue: Exponential decay from blue (200) to red (0)
		// The function creates a steeper drop at the beginning for blue->green transition
		// Then a more gradual transition through yellow to red
		const hue = 200 * Math.E ** (-2.3 * clampedIntensity);

		// Saturation: Logistic growth function
		// Starts at ~45 for low impact (icy blue), grows to ~90 for high impact (red)
		// The steepness parameter (8) and midpoint (0.4) control the transition speed
		const saturation = 45 + 20 / (1 + Math.exp(-8 * (clampedIntensity - 0.4)));

		// Lightness: Inverse exponential function
		// Starts bright (85) for low impact, decreases to darker (45) for high impact
		const lightness = 75 + 10 * Math.exp(-1.8 * clampedIntensity);

		// Apply final clamping to ensure valid CSS values
		const clampedHue = Math.max(0, Math.min(360, hue));
		const clampedSaturation = Math.max(30, Math.min(95, saturation));
		const clampedLightness = Math.max(60, Math.min(90, lightness));

		// Dynamic shadow opacity using a combination of linear and sine functions
		// Creates more dramatic shadows for higher impact levels
		const baseOpacity =
			0.12 + 0.13 * DynamicColorManager.smoothStep(0.1, 0.9, clampedIntensity);
		const shadowModulation = 1 + 0.3 * Math.sin(Math.PI * clampedIntensity);
		const shadowOpacity = baseOpacity * shadowModulation;
		const shadowOpacityLight = shadowOpacity * 0.48;

		// Generate shadow colors
		const shadowColor = `hsla(${clampedHue}, ${clampedSaturation}%, ${clampedLightness}%, ${shadowOpacity})`;
		const shadowColorLight = `hsla(${clampedHue}, ${clampedSaturation}%, ${clampedLightness}%, ${shadowOpacityLight})`;

		// Mathematical calculation for hover effects
		// Uses exponential functions to create non-linear responses
		const hoverSaturationBoost = 10 * (1 - Math.exp(-2 * clampedIntensity));
		const backgroundLightnessBoost = 25 * Math.exp(-clampedIntensity);
		const backgroundSaturationReduction =
			20 * (1 - Math.exp(-3 * clampedIntensity));

		return {
			borderColor: `hsla(${clampedHue}, ${clampedSaturation}%, ${Math.min(clampedLightness + 15, 85)}%, 0.4)`,
			borderColorHover: `hsla(${clampedHue}, ${Math.min(clampedSaturation + hoverSaturationBoost, 95)}%, ${clampedLightness}%, 0.6)`,
			backgroundColor: `hsla(${clampedHue}, ${Math.max(clampedSaturation - backgroundSaturationReduction, 15)}%, ${Math.min(clampedLightness + backgroundLightnessBoost, 95)}%, 0.8)`,
			boxShadow: `0 0 25px ${shadowColor}, 0 0 30px ${shadowColorLight}`,
		};
	}

	/**
	 * Generates dynamic CSS styles for a given impact level
	 */
	static generateDynamicStyles(
		carbonGrams: number,
		waterMl: number,
	): {
		borderColor: string;
		borderColorHover: string;
		backgroundColor: string;
		boxShadow: string;
	} {
		const intensity = DynamicColorManager.calculateImpactIntensity(
			carbonGrams,
			waterMl,
		);
		return DynamicColorManager.generateImpactColor(intensity);
	}
}
