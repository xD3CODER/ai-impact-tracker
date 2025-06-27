// src/providers/claude.ts - Claude provider configuration
import type { Provider } from "@/types/provider";
import { createAdaptiveImpact } from "@/utils/calculations/impact";
import { registerProvider } from "@/utils/providers/registry";

export const claudeProvider: Provider = {
	id: "claude",
	name: "Claude",
	hostnames: ["claude.ai"],
	metrics: {
		// Adaptive impact with custom thresholds for Claude (efficient model)
		carbon: createAdaptiveImpact(
			1.8, // Min: Claude is more efficient for simple requests
			6.5, // Max: But can consume more for complex tasks
		),
		water: createAdaptiveImpact(
			45, // Min: Less water for simple requests
			150, // Max: High consumption for long analyses
		),
		sources: ["Anthropic Research (2024)"],
		// Custom thresholds for Claude (more patient than ChatGPT)
		durationThresholds: {
			simple: 3, // < 3s = simple request (Claude more patient)
			complex: 20, // > 20s = complex request
		},
	},
	endpoints: ["/api/organizations/.*/chat_conversations/.*/completion"],
	config: {
		timeout: 5000,
		// Specific configuration for filtering
		filtering: {
			methods: ["POST"], // Only POST requests
			useRegex: true, // Enable regex support
			excludeEndpoints: [
				"/api/auth/",
				"/api/organizations/.*/users",
				"/api/organizations/.*/billing",
				"\\.(js|css|png|jpg|svg|woff|woff2)$",
			],
		},
	},
};

registerProvider(claudeProvider);
