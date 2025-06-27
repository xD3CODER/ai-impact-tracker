// src/overlay.content.tsx - React overlay with Shadow DOM for carbon tracking (WXT)
import "@/styles/global.css";
import CarbonTrackerOverlay from "@/components/overlay/CarbonTrackerOverlay";
import { generateManifestUrls } from "@/utils/providers/detection";
import { logger } from "@/utils/core/logger";
import React from "react";
import ReactDOM from "react-dom/client";
import {
	type ContentScriptContext,
	createShadowRootUi,
	defineContentScript,
} from "#imports";

// Generate URLs dynamically from the provider registry
const urls = generateManifestUrls();

export default defineContentScript({
	matches: urls.contentScriptMatches,
	runAt: "document_idle",
	cssInjectionMode: "ui",
	async main(ctx) {
		const ui = await createUi(ctx);
		ui.mount();
	},
});

function createUi(ctx: ContentScriptContext) {
	return createShadowRootUi(ctx, {
		name: "react-ui",
		position: "inline",
		append: "first",
		onMount(container) {
			logger.log("🚀 Creating overlay...");
			const root = ReactDOM.createRoot(container);
			root.render(
				<React.StrictMode>
					<CarbonTrackerOverlay />
				</React.StrictMode>,
			);
			return root;
		},
		onRemove(root) {
			root?.unmount();
		},
	});
}
