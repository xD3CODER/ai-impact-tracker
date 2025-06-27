import AboutSection from "@/components/popup/AboutSection";
import PrivacyInfoSection from "@/components/popup/PrivacyInfoSection";
import ProvidersList from "@/components/popup/ProvidersList";
import ToggleRow from "@/components/popup/ToggleRow";
import { useAppContext } from "@/context/AppContext";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { css } from "styled-system/css";
import { sectionCard, sectionHeader } from "styled-system/patterns";

const SettingsPage: React.FC = () => {
	const navigate = useNavigate();
	const { toastEnabled, onToastToggle } = useAppContext();

	const containerClasses = css({
		background: "white",
		borderRadius: "0",
		margin: "0",
		overflow: "hidden",
		boxShadow: "none",
		width: "100%",
		height: "100%",
		minWidth: "380px",
		minHeight: "500px",
		display: "flex",
		flexDirection: "column",
	});

	const headerClasses = css({
		background: "brand.gradient",
		color: "white",
		padding: "4",
		display: "flex",
		alignItems: "center",
		gap: "3",
		flexShrink: 0,
	});

	const backButtonClasses = css({
		background: "rgba(255, 255, 255, 0.2)",
		border: "none",
		color: "white",
		py: "1",
		px: "2",
		borderRadius: "xl",
		fontWeight: "medium",
		fontSize: "xs",
		cursor: "pointer",
		display: "flex",
		alignItems: "center",
		gap: "1",
		transition: "all 0.2s ease",
		_hover: {
			background: "rgba(255, 255, 255, 0.3)",
			transform: "scale(1.05)",
		},
	});

	const titleClasses = css({
		fontSize: "lg",
		fontWeight: "bold",
		flex: 1,
		textAlign: "center",
		margin: 0,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		gap: "2",
	});

	const spacerClasses = css({
		width: "60px",
		height: "1px",
		visibility: "hidden",
	});

	const mainClasses = css({
		padding: "5",
		flex: 1,
		overflow: "auto",
		minHeight: 0,
	});

	return (
		<div className={containerClasses}>
			<header className={headerClasses}>
				<button
					type={"button"}
					onClick={() => navigate("/")}
					className={backButtonClasses}
				>
					←️ {i18n.t("back")}
				</button>
				<h1 className={titleClasses}>⚙️ {i18n.t("settings")}</h1>
				{/* Invisible spacer for balance */}
				<div className={spacerClasses} />
			</header>

			<main className={mainClasses}>
				<div className={sectionCard({ color: "gray.50", border: "gray.200" })}>
					<h2 className={sectionHeader({ size: "md", color: "gray.800" })}>
						{i18n.t("notifications")}
					</h2>
					<ToggleRow
						label={i18n.t("toastInPagesLabel")}
						description={i18n.t("toastInPagesDesc")}
						checked={toastEnabled}
						onChange={onToastToggle}
					/>
				</div>
				<div
					className={sectionCard({ color: "green.50", border: "green.100" })}
				>
					<PrivacyInfoSection />
				</div>
				<div className={sectionCard({ color: "white", border: "gray.200" })}>
					<ProvidersList />
				</div>
				<div className={sectionCard({ color: "white", border: "gray.200" })}>
					<AboutSection />
				</div>
			</main>
		</div>
	);
};

export default SettingsPage;
