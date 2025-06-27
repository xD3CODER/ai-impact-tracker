// src/types/global.d.ts - Types globaux de l'application
export interface Logger {
	info: (message: string, ...args: any[]) => void;
	warn: (message: string, ...args: any[]) => void;
	error: (message: string, ...args: any[]) => void;
	debug: (message: string, ...args: any[]) => void;
}

// Déclaration globale pour l'objet i18n de WXT
declare global {
	const i18n: {
		t: (key: string, substitutions?: string | string[]) => string;
	};

	// Constantes d'équivalences générées au build time
	const __CARBON_THRESHOLDS__: readonly number[];
	const __WATER_THRESHOLDS__: readonly number[];
	const __CARBON_THRESHOLD_COUNTS__: Record<number, number>;
	const __WATER_THRESHOLD_COUNTS__: Record<number, number>;
}
