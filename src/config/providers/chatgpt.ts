// src/providers/chatgpt.ts - ChatGPT provider configuration
import type { Provider } from "@/types/provider";
import { createAdaptiveImpact } from "@/utils/calculations/impact";
import { registerProvider } from "@/utils/providers/registry";

const chatgptProvider: Provider = {
	id: "chatgpt",
	name: "ChatGPT",
	hostnames: ["chatgpt.com", "chat.openai.com"],
	metrics: {
		// Adaptive impact based on duration (GPT-4 = medium/heavy model)
		carbon: createAdaptiveImpact(
			2.5, // Simple requests (< 2s): short questions, quick responses
			8.0, // Complex requests (> 15s): long analyses, code, reasoning
		),
		water: createAdaptiveImpact(
			60, // ml for simple requests
			180, // ml for complex requests
		),
		sources: ["Washington Post", "UC Riverside (2024)"],
		// Shared thresholds for carbon AND water
		durationThresholds: {
			simple: 2, // < 2s = simple request
			complex: 15, // > 15s = complex request
		},
	},
	endpoints: ["/conversation$"],
	config: {
		timeout: 5000,
		filtering: {
			methods: ["POST"],
			useRegex: true,
			excludeEndpoints: [
				"/backend-api/accounts",
				"/backend-api/models",
				"/backend-api/me",
				"/_next/",
				"\\.(js|css|png|jpg|svg|woff|woff2)$",
			],
		},
	},
};

registerProvider(chatgptProvider);

// Export for use in entrypoints
export { chatgptProvider };
