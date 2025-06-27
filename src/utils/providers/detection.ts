// src/providers/index.ts - Automatic provider discovery system
import type { ManifestUrls, Provider } from "@/types/provider";
import "@/config/providers";
import { getProviders } from "@/utils/providers/registry";
import { logger } from "@/utils/core/logger";

// Variables for lazy cache
let providersCache: Provider[] | null = null;
let hostnameToProviderCache: Record<string, Provider> | null = null;
let manifestUrlsCache: ManifestUrls | null = null;

/**
 * Initialise the providers cache lazily
 */
function ensureProvidersLoaded(): Provider[] {
	if (providersCache === null) {
		providersCache = getProviders();
		logger.log(
			"🔌 Providers loaded:",
			providersCache.map((p) => p.name),
		);
	}
	return providersCache;
}

/**
 * Initialise the hostname->provider cache lazily
 */
function ensureHostnameMapLoaded(): Record<string, Provider> {
	if (hostnameToProviderCache === null) {
		const providers = ensureProvidersLoaded();
		hostnameToProviderCache = Object.fromEntries(
			providers.flatMap((provider: Provider) =>
				provider.hostnames.map((hostname: string) => [hostname, provider]),
			),
		);
		logger.log(
			"🗺️ Mapping hostname->provider created:",
			Object.keys(hostnameToProviderCache),
		);
	}
	return hostnameToProviderCache;
}

/**
 * Get a provider by hostname
 */
export const getProviderByHostname = (
	hostname: string,
): Provider | undefined => {
	const hostnameMap = ensureHostnameMapLoaded();
	return hostnameMap[hostname];
};

/**
 * Get all providers (with lazy loading)
 */
export const getAllProviders = (): Provider[] => {
	return ensureProvidersLoaded();
};

/**
 * Generate URLs for the Chrome manifest (with caching)
 */
export function generateManifestUrls(): ManifestUrls {
	if (manifestUrlsCache) return manifestUrlsCache;

	// Use Set to automatically avoid duplicates
	const permissions = new Set<string>();
	const providers = ensureProvidersLoaded();

	providers.forEach((provider: Provider) => {
		provider.hostnames.forEach((hostname: string) => {
			permissions.add(`*://${hostname}/*`);
		});
	});

	const urls = Array.from(permissions);

	manifestUrlsCache = {
		hostPermissions: urls,
		contentScriptMatches: urls,
	};

	logger.log("📋 Generated manifest URLs:", urls);
	return manifestUrlsCache;
}
