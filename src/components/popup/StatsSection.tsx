import StatCard from "@/components/common/StatCard";
import ImpactMessageCard from "@/components/common/ImpactMessageCard";
import { useAppContext } from "@/context/AppContext";
import { CarbonCalculator } from "@/utils/calculations/carbon";
import {
	formatDuration,
	formatCarbon,
	formatWater,
} from "@/utils/formatting/display";
import type React from "react";
import { css } from "styled-system/css";

const StatsSection: React.FC = () => {
	const { stats, viewMode } = useAppContext();
	const impactMessages = CarbonCalculator.getImpactMessages(
		stats.carbon,
		stats.water,
		stats.requests,
	);

	const containerClasses = css({
		backgroundColor: "gray.50",
		borderRadius: "lg",
		border: "1px solid",
		borderColor: "gray.200",
		padding: "4",
		marginBottom: "6",
	});

	const headerClasses = css({
		fontSize: "lg",
		fontFamily: "heading",
		fontWeight: "semibold",
		color: "gray.800",
		display: "flex",
		alignItems: "center",
		gap: "2",
		marginBottom: "3",
	});

	const statsGridClasses = css({
		display: "grid",
		gridTemplateColumns: "repeat(2, 1fr)",
		gap: "3",
		marginBottom: "4",
	});

	const impactMessageContainerClasses = css({
		marginBottom: "4",
	});

	return (
		<div className={containerClasses}>
			<h2 className={headerClasses}>
				📊{" "}
				{viewMode === "daily"
					? i18n.t("todayConsumption")
					: i18n.t("totalConsumption")}
			</h2>

			<div className={statsGridClasses}>
				<StatCard value={stats.requests} label={`🌐 ${i18n.t("requests")}`} />

				<StatCard
					value={formatCarbon(stats.carbon)}
					label={`🌎 ${i18n.t("carbon")}`}
				/>

				<StatCard
					value={formatWater(stats.water)}
					label={`💧 ${i18n.t("water")}`}
				/>

				<StatCard
					value={formatDuration(stats.totalDuration || 0)}
					label={`⏳ ${i18n.t("totalDuration")}`}
				/>
			</div>

			<div className={impactMessageContainerClasses}>
				<ImpactMessageCard messages={impactMessages} />
			</div>
		</div>
	);
};

export default StatsSection;
