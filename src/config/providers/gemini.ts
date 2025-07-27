// src/providers/gemini.ts - Google Gemini provider configuration
import type { Provider } from "@/types/provider";
import { createAdaptiveImpact } from "@/utils/calculations/impact";
import { registerProvider } from "@/utils/providers/registry";

export const geminiProvider: Provider = {
	id: "gemini",
	name: "Google Gemini",
	hostnames: ["gemini.google.com", "bard.google.com"],
	metrics: {
		carbon: createAdaptiveImpact(1.5, 5.5),
		water: createAdaptiveImpact(40, 120),
		sources: [
			"Google Environmental Report (2023)",
			"Carbon Emissions and Large Neural Network Training (Google Research)",
			"Estimated based on Google's TPU efficiency and 100% renewable energy matching",
		],
		durationThresholds: {
			simple: 2.5,
			complex: 18,
		},
	},
	endpoints: [
		"/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate",
	],
	config: {
		timeout: 5000,
		filtering: {
			methods: ["POST"],
		},
	},
};

registerProvider(geminiProvider);
