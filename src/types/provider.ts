// src/types/provider.ts - Interface for modular AI providers

// Type for an adaptive impact based on the duration of the request
export interface AdaptiveImpact {
	min: number; // Minimum impact (short/simple requests)
	max: number; // Maximum impact (long/complex requests)
}

// Type union for metrics: fixed value or adaptive
export type ImpactValue = number | AdaptiveImpact;

// Duration thresholds for classifying requests (in seconds)
export interface DurationThresholds {
	simple: number; // < simple = min impact
	complex: number; // > complex = max impact
	// Between simple and complex = interpolation
}

export interface Provider {
	// Unique identifier for the provider
	id: string;

	// Display name
	name: string;

	// Supported hostnames (URLs where this provider is active)
	hostnames: string[];

	// Environmental metrics
	metrics: {
		carbon: ImpactValue; // gCO₂e per request (fixed or adaptive)
		water: ImpactValue; // ml of water per request (fixed or adaptive)
		// Shared duration thresholds for carbon AND water
		durationThresholds?: DurationThresholds;
		// Optional fields used in certain providers
		sources: string[];
	};

	// API endpoints for detection (string or regex)
	endpoints: string[];

	// Optional specific configuration
	config?: {
		timeout?: number; // Used in reactive-storage.ts to clean active requests
		// Configuration for request filtering
		filtering?: {
			methods?: string[]; // Allowed HTTP methods (POST, GET, etc.)
			excludeEndpoints?: string[]; // Endpoints to exclude
			includeOnly?: string[]; // If specified, only capture these endpoints
			useRegex?: boolean; // If true, treat patterns as regex
		};
	};
}

// Utility to generate URLs from hostnames for the manifest
export interface ManifestUrls {
	hostPermissions: string[];
	contentScriptMatches: string[];
}
