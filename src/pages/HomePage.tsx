import ServicesSection from "@/components/popup/ServicesSection";
import StatsSection from "@/components/popup/StatsSection";
import AppIcon from "@/icons/icon32.png";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { css } from "styled-system/css";

const HomePage: React.FC = () => {
	const navigate = useNavigate();

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
		justifyContent: "space-between",
		alignItems: "center",
		flexShrink: 0,
	});

	const titleClasses = css({
		fontSize: "lg",
		fontWeight: "bold",
		display: "flex",
		alignItems: "center",
		gap: "2",
	});

	const iconClasses = css({
		width: "24px",
		height: "24px",
		verticalAlign: "middle",
		marginRight: "6",
	});

	const settingsButtonClasses = css({
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

	const mainClasses = css({
		padding: "5",
		flex: 1,
		overflow: "auto",
		minHeight: 0,
	});

	return (
		<div className={containerClasses}>
			<header className={headerClasses}>
				<h1 className={titleClasses}>
					<img src={AppIcon} alt="App icon" className={iconClasses} />
					{i18n.t("appName")}
				</h1>
				<button
					type={"button"}
					onClick={() => navigate("/settings")}
					className={settingsButtonClasses}
				>
					⚙️ {i18n.t("settings")}
				</button>
			</header>

			<main className={mainClasses}>
				<StatsSection />
				<ServicesSection />
			</main>
		</div>
	);
};

export default HomePage;
