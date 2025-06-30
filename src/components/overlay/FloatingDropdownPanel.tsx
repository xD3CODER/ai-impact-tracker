import StatCard from "@/components/common/StatCard";
import ImpactMessageCard from "@/components/common/ImpactMessageCard";
import type { ServiceStats } from "@/types/carbon";
import type { Provider } from "@/types/provider";
import { CarbonCalculator } from "@/utils/calculations/carbon";
import {
	formatDuration,
	formatCarbon,
	formatWater,
} from "@/utils/formatting/display";
import type React from "react";
import { css } from "styled-system/css";

interface DropdownState {
	shouldRender: boolean;
	isAnimating: boolean;
	isHidden: boolean;
	showCloseButton: boolean;
}

interface FloatingDropdownPanelProps {
	provider: Provider;
	dropdownState: DropdownState;
	serviceStats: ServiceStats;
	dynamicColors: {
		backgroundColor: string;
		borderColor: string;
		borderColorHover: string;
		boxShadow: string;
	};
}

const FloatingDropdownPanel: React.FC<FloatingDropdownPanelProps> = ({
	provider,
	dropdownState,
	serviceStats,
	dynamicColors,
}) => {
	// Calculate impact messages locally
	const impactMessages = CarbonCalculator.getImpactMessages(
		serviceStats.carbon,
		serviceStats.water,
		serviceStats.requests,
	);

	const dropdownContainerClasses = css({
		position: "absolute",
		top: "calc(100% + 6px)",
		right: "0",
		minWidth: "300px",
		shadow: "xl",
		border: "6px solid",
		backdropFilter: "auto",
		backdropBlur: "sm",
		borderRadius: "18px",
		overflow: "hidden",
		transformOrigin: "top right",
		transition: "all 0.3s ease",
		pointerEvents: dropdownState.isAnimating ? "auto" : "none",
		zIndex: 30,
	});

	const dropdownInnerClasses = css({
		background: "rgba(255, 255, 255, 0.2)",
		borderRadius: "6px",
		border: "1px solid #ffffff66",
	});

	const dropdownContentClasses = css({
		padding: "4",
		borderRadius: "12px",
	});

	const headerClasses = css({
		display: "flex",
		alignItems: "center",
		gap: "2",
		marginBottom: "3",
	});

	const providerNameClasses = css({
		fontFamily: "heading",
		fontWeight: "semibold",
		color: "gray.900",
	});

	const statsGridClasses = css({
		display: "grid",
		gridTemplateColumns: "1fr 1fr",
		gap: "2",
		marginBottom: "3",
	});

	const impactMessageContainerClasses = css({
		marginBottom: "3",
	});

	const dataPeriodClasses = css({
		fontSize: "xs",
		color: "gray.700",
		textAlign: "center",
	});

	if (!dropdownState.shouldRender) {
		return null;
	}

	return (
		<div
			className={dropdownContainerClasses}
			style={{
				borderColor: dynamicColors.borderColor,
				opacity: dropdownState.isAnimating ? "1" : "0",
			}}
		>
			<div className={dropdownInnerClasses}>
				<div
					className={dropdownContentClasses}
					style={{
						background: dynamicColors.backgroundColor,
					}}
				>
					{/* Header */}
					<div className={headerClasses}>
						<span className={providerNameClasses}>{provider.name}</span>
					</div>

					{/* Stats Grid */}
					<div className={statsGridClasses}>
						<StatCard
							value={serviceStats.requests}
							label={`🌐 ${i18n.t("requests")}`}
							dynamicColors={dynamicColors}
						/>

						<StatCard
							value={formatCarbon(serviceStats.carbon)}
							label={`🌎 ${i18n.t("carbon")}`}
							dynamicColors={dynamicColors}
						/>
						<StatCard
							value={formatWater(serviceStats.water)}
							label={`💧 ${i18n.t("water")}`}
							dynamicColors={dynamicColors}
						/>

						<StatCard
							value={formatDuration(serviceStats.totalDuration || 0)}
							label={`⏳ ${i18n.t("duration")}`}
							dynamicColors={dynamicColors}
						/>
					</div>

					{/* Impact Message with ImpactMessageCard */}
					<div className={impactMessageContainerClasses}>
						<ImpactMessageCard
							messages={impactMessages}
							dynamicColors={dynamicColors}
						/>
					</div>

					{/* Data period */}
					<div className={dataPeriodClasses}>📅 {i18n.t("dailyData")}</div>
				</div>
			</div>
		</div>
	);
};

export default FloatingDropdownPanel;
