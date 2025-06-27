// providers/registry.ts
import type { Provider } from "@/types/provider"; // Ajustez le chemin selon votre structure

const providers: Provider[] = [];

export function registerProvider(provider: Provider) {
	providers.push(provider);
}

export function getProviders(): Provider[] {
	return [...providers];
}
