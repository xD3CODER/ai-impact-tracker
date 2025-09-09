// src/providers/gemini.ts - Google Gemini provider configuration
import type { Provider } from "@/types/provider";
import { createAdaptiveImpact } from "@/utils/calculations/impact";
import { registerProvider } from "@/utils/providers/registry";

export const geminiProvider: Provider = {
	id: "gemini",
	name: "Google Gemini",
	hostnames: ["gemini.google.com", "bard.google.com"],
	metrics: {
		carbon: createAdaptiveImpact(0.02, 0.07),
		water: createAdaptiveImpact(0.12, 0.34),
		sources: [
			"Google Environmental Report (2025)",
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
