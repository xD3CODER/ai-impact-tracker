// src/types/carbon.d.ts - Types pour le tracking carbone/eau

export interface ServiceStats {
	requests: number;
	carbon: number;
	water: number;
	totalDuration: number; // Durée totale en millisecondes
	confidence?: string;
	source?: string;
}

export interface TotalFootprint {
	requests: number;
	carbon: number;
	water: number;
	totalDuration: number; // Durée totale en millisecondes
	services: Record<string, ServiceStats>;
}

export interface DailyCarbonData {
	totalCarbon: number;
	totalWater: number;
	requests: number;
	totalDuration: number; // Durée totale en millisecondes
	services: Record<string, ServiceStats>;
}

export interface AIRequest {
	service: string;
	carbonImpact: number;
	waterImpact: number;
	timestamp: number;
	url: string;
	method: string;
	duration?: number; // Durée de cette requête en millisecondes
	requestNumber?: number;
}

export interface StorageData {
	carbonData: Record<string, DailyCarbonData>;
	requestCount: number;
	lastRequest: AIRequest;
	toastEnabled: boolean;
}

export interface MessageResponse {
	success: boolean;
	data?: any;
	error?: string;
	message?: string;
	method?: string;
}

export interface ExtensionMessage {
	type:
		| "AI_REQUEST_DETECTED"
		| "GET_STATS"
		| "GET_SERVICE_INFO"
		| "OPEN_POPUP"
		| "RESET_SERVICE_STATS";
	data?: any;
	hostname?: string;
}

export type ImpactLevel = "low" | "medium" | "high";

export interface EquivalenceData {
	water: string;
	carbon: string;
	combined: string;
}
