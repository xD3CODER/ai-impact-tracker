import { AppContextProvider } from "@/context/AppContext";
import HomePage from "@/pages/HomePage";
import SettingsPage from "@/pages/SettingsPage";
import type React from "react";
// src/popup.tsx - Chrome extension popup interface with WXT
import { createRoot } from "react-dom/client";
import { Route, MemoryRouter as Router, Routes } from "react-router-dom";
import { css } from "styled-system/css";
import "@/styles/global.css";

const PopupRoot: React.FC = () => {
	return (
		<AppContextProvider viewMode="global">
			<div className={css({ fontFamily: "body" })}>
				<Router>
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/settings" element={<SettingsPage />} />
					</Routes>
				</Router>
			</div>
		</AppContextProvider>
	);
};

// Modern WXT: render directly into DOM
const container = document.getElementById("root");
if (container) {
	const root = createRoot(container);
	root.render(<PopupRoot />);
}
