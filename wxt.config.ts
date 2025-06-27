import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "wxt";

// Function to extract constants from JSON files
function generateEquivalenceConstants() {
	try {
		const enData = JSON.parse(
			readFileSync(resolve("src/locales/en.json"), "utf8"),
		);

		// Extract carbon thresholds
		const carbonThresholds = Object.keys(enData.equivalencesCarbon || {})
			.map((key) => {
				const value = key.includes("_")
					? Number.parseFloat(key.replace("_", "."))
					: Number.parseFloat(key);
				return Number.isNaN(value) ? 0 : value;
			})
			.filter((value) => !Number.isNaN(value))
			.sort((a, b) => a - b);

		// Extract water thresholds
		const waterThresholds = Object.keys(enData.equivalencesWater || {})
			.map((key) => {
				const value = key.includes("_")
					? Number.parseFloat(key.replace("_", "."))
					: Number.parseFloat(key);
				return Number.isNaN(value) ? 0 : value;
			})
			.filter((value) => !Number.isNaN(value))
			.sort((a, b) => a - b);

		// Count equivalences by threshold
		const carbonCounts: Record<number, number> = {};
		const waterCounts: Record<number, number> = {};

		for (const [key, equivalences] of Object.entries(
			enData.equivalencesCarbon || {},
		)) {
			const value = key.includes("_")
				? Number.parseFloat(key.replace("_", "."))
				: Number.parseFloat(key);
			if (!Number.isNaN(value) && Array.isArray(equivalences)) {
				carbonCounts[value] = equivalences.length;
			}
		}

		for (const [key, equivalences] of Object.entries(
			enData.equivalencesWater || {},
		)) {
			const value = key.includes("_")
				? Number.parseFloat(key.replace("_", "."))
				: Number.parseFloat(key);
			if (!Number.isNaN(value) && Array.isArray(equivalences)) {
				waterCounts[value] = equivalences.length;
			}
		}

		return {
			__CARBON_THRESHOLDS__: carbonThresholds,
			__WATER_THRESHOLDS__: waterThresholds,
			__CARBON_THRESHOLD_COUNTS__: carbonCounts,
			__WATER_THRESHOLD_COUNTS__: waterCounts,
		};
	} catch (error) {
		console.warn("⚠️ Warning: Error generating equivalence constants:", error);
		return {
			__CARBON_THRESHOLDS__: JSON.stringify([0]),
			__WATER_THRESHOLDS__: JSON.stringify([0]),
			__CARBON_THRESHOLD_COUNTS__: JSON.stringify({}),
			__WATER_THRESHOLD_COUNTS__: JSON.stringify({}),
		};
	}
}

export default defineConfig({
	// Use the src folder for source code
	srcDir: "src",

	// WXT modules (includes our local module)
	modules: ["@wxt-dev/module-react", "@wxt-dev/i18n/module"],

	// Custom aliases according to WXT recommendations
	alias: {
		"@": resolve("src"),
		"styled-system": resolve("styled-system"),
	},

	// Manifest configuration (permissions will be auto-generated)
	manifest: {
		name: "__MSG_appName__",
		description: "__MSG_appDescription__",
		default_locale: "en",
		permissions: ["storage", "activeTab", "webRequest", "alarms"],
		host_permissions: [
			"*://claude.ai/*",
			"*://chatgpt.com/*",
			"*://chat.openai.com/*",
		],
		action: {
			default_popup: "popup.html",
			default_title: "__MSG_defaultTitle__",
		},
		icons: {
			16: "icons/icon16.png",
			32: "icons/icon32.png",
			48: "icons/icon48.png",
			128: "icons/icon128.png",
		},
		web_accessible_resources: [
			{
				resources: ["popup.html", "icons/*", "*.css", "content-scripts/*"],
				matches: ["<all_urls>"],
			},
		],
	},

	// Vite configuration to integrate Panda CSS and Preact
	vite: () => ({
		css: {
			postcss: "./postcss.config.cjs",
		},
		assetsInclude: ["**/*.svg"],
		resolve: {
			alias: {
				// Alias for Preact in production (optimization size)
				...(process.env.NODE_ENV === "production"
					? {
							react: "preact/compat",
							"react-dom": "preact/compat",
							"react/jsx-runtime": "preact/jsx-runtime",
						}
					: {}),
			},
		},
		define: {
			"process.env.NODE_ENV": JSON.stringify(
				process.env.NODE_ENV || "development",
			),
			"process.env.DEBUG": JSON.stringify(
				process.env.NODE_ENV === "development" ? "true" : "false",
			),
			// Auto-generated equivalence constants at build time
			...generateEquivalenceConstants(),
		},
	}),

	// Hooks to customize the build
	hooks: {
		"build:before": async () => {
			// Generate CSS with Panda before build
			const { execSync } = await import("node:child_process");
			execSync("panda codegen --silent", { stdio: "inherit" });

			// Generate i18n messages directly in .output
			console.log("🌐 Generating i18n messages...");
		},

		// Hook to force host_permissions after complete generation
		"build:done": async () => {
			const { writeFile, readFile, access } = await import("node:fs/promises");
			const manifestPath = ".output/chrome-mv3/manifest.json";

			// Wait a bit to ensure WXT has finished writing the file
			await new Promise((resolve) => setTimeout(resolve, 100));

			try {
				// Check that the file exists
				await access(manifestPath);

				const manifestContent = await readFile(manifestPath, "utf-8");
				const manifest = JSON.parse(manifestContent);

				console.log("📋 Manifest before modification:", {
					host_permissions: manifest.host_permissions,
					web_accessible_resources: manifest.web_accessible_resources,
				});

				// Improve web_accessible_resources
				manifest.web_accessible_resources = [
					{
						resources: ["popup.html", "icons/*", "*.css", "content-scripts/*"],
						matches: ["<all_urls>"],
					},
				];

				await writeFile(manifestPath, JSON.stringify(manifest, null, 4));
				console.log(
					"🎯 Host permissions and web_accessible_resources updated in final manifest",
				);

				// Check that changes have been saved
				const updatedContent = await readFile(manifestPath, "utf-8");
				const updatedManifest = JSON.parse(updatedContent);
				console.log("✅ Manifest after modification:", {
					host_permissions: updatedManifest.host_permissions,
					web_accessible_resources:
						updatedManifest.web_accessible_resources?.length,
				});
			} catch (error) {
				console.warn("⚠️ Error updating manifest:", error);
			}
		},
	},
});
