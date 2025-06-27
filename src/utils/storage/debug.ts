// src/utils/storage-debug.ts - Utilitaires de debug pour le storage

import type { AIRequest } from "@/types/carbon";
import { ReactiveStorage } from "./reactive";
import { logger } from "@/utils/core/logger";
import { browser } from "wxt/browser";

/**
 * Debug function to inspect storage
 */
export async function debugStorage() {
	logger.log("🔍 Debug Storage - Current state:");

	try {
		const globalStats = await ReactiveStorage.getGlobalStats();
		logger.log("🌍 Global stats:", globalStats);

		const todayData = await ReactiveStorage.getTodayData();
		logger.log("📅 Today's data:", todayData);

		const activeRequests = await ReactiveStorage.getAllActiveRequests();
		logger.log("🔄 Active requests:", activeRequests);

		return { globalStats, todayData, activeRequests };
	} catch (error) {
		console.error("❌ Error debugging storage:", error);
		return null;
	}
}

/**
 * Clean all NaN/corrupted data
 */
export async function cleanAllNaNData() {
	logger.log("🧹 Complete cleanup of NaN data...");

	try {
		await ReactiveStorage.clearAllData();
		logger.log("✅ All data cleaned");

		// Reset with clean data
		const testRequest: AIRequest = {
			service: "test",
			carbonImpact: 1.0,
			waterImpact: 2.0,
			timestamp: Date.now(),
			url: "https://test.com",
			method: "POST",
			duration: 1000,
		};

		await ReactiveStorage.recordAIRequest(testRequest);
		logger.log("✅ Test data added");

		return await debugStorage();
	} catch (error) {
		console.error("❌ Error cleaning data:", error);
		return null;
	}
}

/**
 * Test recording a request
 */
export async function testRecordRequest() {
	logger.log("🧪 Testing request recording...");

	const testRequest: AIRequest = {
		service: "chatgpt",
		carbonImpact: 2.5,
		waterImpact: 45,
		duration: 3500,
		timestamp: Date.now(),
		url: "https://chatgpt.com/api/conversation",
		method: "POST",
	};

	try {
		await ReactiveStorage.recordAIRequest(testRequest);
		logger.log("✅ Test request recorded:", testRequest);

		const stats = await ReactiveStorage.getGlobalStats();
		logger.log("📊 Stats after test:", stats);

		return stats;
	} catch (error) {
		console.error("❌ Error testing request:", error);
		return null;
	}
}

/**
 * Test active requests system
 */
export async function testActiveRequests() {
	logger.log("🧪 Testing active requests system...");

	try {
		const serviceName = "chatgpt";
		const requestId = `test-active-${Date.now()}`;

		await ReactiveStorage.markRequestStart(serviceName, requestId);
		logger.log("✅ Request marked as active");

		let activeRequests = await ReactiveStorage.getAllActiveRequests();
		logger.log("🔄 Active requests after start:", activeRequests);

		// Wait 2 seconds
		await new Promise((resolve) => setTimeout(resolve, 2000));

		await ReactiveStorage.markRequestEnd(serviceName, requestId);
		logger.log("✅ Request marked as completed");

		activeRequests = await ReactiveStorage.getAllActiveRequests();
		logger.log("🔄 Active requests after end:", activeRequests);

		return activeRequests;
	} catch (error) {
		console.error("❌ Error testing active requests:", error);
		return null;
	}
}

/**
 * Display all debug information at once
 */
export async function fullDebugReport() {
	logger.log("🔍 === RAPPORT DE DEBUG COMPLET ===");

	const storage = await debugStorage();
	logger.log("\n🧪 Test recording request...");
	await testRecordRequest();

	logger.log("\n🔄 Test active requests...");
	await testActiveRequests();

	logger.log("\n📊 Final state:");
	await debugStorage();

	return storage;
}

// Function to compare daily vs global data
export async function compareDailyVsGlobal() {
	logger.log("\n🔍 === DAILY VS GLOBAL DATA COMPARISON ===");

	try {
		const todayData = await ReactiveStorage.getTodayData();
		const globalData = await ReactiveStorage.getGlobalStats();

		logger.log("📊 Today's data:", todayData);
		logger.log("🌍 Global data:", globalData);

		logger.log("\n🔬 Analyse comparative:");
		logger.log(
			`- Today's requests: ${todayData.requests} | Global: ${globalData.requests}`,
		);
		logger.log(
			`- Today's carbon: ${todayData.totalCarbon} | Global: ${globalData.carbon}`,
		);
		logger.log(
			`- Today's water: ${todayData.totalWater} | Global: ${globalData.water}`,
		);
		logger.log(
			`- Services today: ${Object.keys(todayData.services).length} | Global: ${Object.keys(globalData.services).length}`,
		);

		// Check inconsistencies
		const issues = [];
		if (todayData.requests > globalData.requests) {
			issues.push("❌ Today's data has more requests than global data!");
		}
		if (todayData.totalCarbon > globalData.carbon) {
			issues.push("❌ Today's data has more carbon than global data!");
		}
		if (todayData.totalWater > globalData.water) {
			issues.push("❌ Today's data has more water than global data!");
		}

		if (issues.length > 0) {
			logger.log("\n⚠️ PROBLEMS DETECTED:");
			issues.forEach((issue) => logger.log(issue));
		} else {
			logger.log("\n✅ Data is consistent");
		}

		return { todayData, globalData, issues };
	} catch (error) {
		console.error("❌ Error comparison:", error);
		return null;
	}
}

// Function to see storage keys
export async function listStorageKeys() {
	logger.log("\n🗂️ === STORAGE KEYS ===");

	try {
		const allData = await browser.storage.local.get();
		const keys = Object.keys(allData);

		logger.log("📋 All keys:", keys);

		const carbonKeys = keys.filter((key) => key.startsWith("carbonData_"));
		const todayKey = `carbonData_${new Date().toISOString().split("T")[0]}`;

		logger.log("🗓️ Carbon data keys:", carbonKeys);
		logger.log("📅 Today's key:", todayKey);
		logger.log("✅ Today's key exists:", keys.includes(todayKey));

		// Display values for each carbon key
		for (const key of carbonKeys) {
			logger.log(`📊 ${key}:`, allData[key]);
		}

		if (allData.globalStats) {
			logger.log("🌍 globalStats:", allData.globalStats);
		}

		return { keys, carbonKeys, todayKey, allData };
	} catch (error) {
		console.error("❌ Error listing keys:", error);
		return null;
	}
}

// Function to simulate a request and see what happens
export async function simulateRequest(serviceName: string) {
	logger.log(`\n🧪 === ${serviceName.toUpperCase()} REQUEST SIMULATION ===`);

	const request = {
		service: serviceName,
		carbonImpact: 2.5,
		waterImpact: 1.2,
		duration: 3000,
		timestamp: Date.now(),
		url: `https://${serviceName}.ai/test`,
		method: "POST",
	};

	logger.log("📤 Sending request:", request);

	try {
		// State before
		const beforeToday = await ReactiveStorage.getTodayData();
		const beforeGlobal = await ReactiveStorage.getGlobalStats();
		logger.log("📊 BEFORE - Today:", beforeToday);
		logger.log("🌍 BEFORE - Global:", beforeGlobal);

		// Record request
		await ReactiveStorage.recordAIRequest(request);

		// State after
		const afterToday = await ReactiveStorage.getTodayData();
		const afterGlobal = await ReactiveStorage.getGlobalStats();
		logger.log("📊 AFTER - Today:", afterToday);
		logger.log("🌍 AFTER - Global:", afterGlobal);

		// Differences
		logger.log("\n📈 CHANGEMENTS:");
		logger.log(
			`- Today's requests: ${beforeToday.requests} → ${afterToday.requests} (+${afterToday.requests - beforeToday.requests})`,
		);
		logger.log(
			`- Global requests: ${beforeGlobal.requests} → ${afterGlobal.requests} (+${afterGlobal.requests - beforeGlobal.requests})`,
		);
		logger.log(
			`- Today's carbon: ${beforeToday.totalCarbon} → ${afterToday.totalCarbon} (+${afterToday.totalCarbon - beforeToday.totalCarbon})`,
		);
		logger.log(
			`- Global carbon: ${beforeGlobal.carbon} → ${afterGlobal.carbon} (+${afterGlobal.carbon - beforeGlobal.carbon})`,
		);

		return { beforeToday, afterToday, beforeGlobal, afterGlobal };
	} catch (error) {
		console.error("❌ Error simulation:", error);
		return null;
	}
}

// Exposer globalement pour debug facile - UNIQUEMENT EN DÉVELOPPEMENT
if (import.meta.env.DEV && typeof window !== "undefined") {
	(window as any).debugCarbonStorage = {
		compareDailyVsGlobal,
		listStorageKeys,
		simulateRequest,
		debugStorage,
		cleanAllNaNData,
	};

	(window as any).debugCarbonTracker = {
		debugStorage,
		cleanAllNaNData,
		testRecordRequest,
		testActiveRequests,
		fullDebugReport,
	};

	logger.log("🔧 Debug functions exposed on window (DEV mode only):");
	logger.log("  - window.debugCarbonStorage");
	logger.log("  - window.debugCarbonTracker");
}
