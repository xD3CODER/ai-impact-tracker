import { useAppContext } from "@/context/AppContext";
import StatCard from "@/components/common/StatCard";
import { formatCarbon, formatWater } from "@/utils/formatting/display";
import type React from "react";
import { css } from "styled-system/css";

const ServicesSection: React.FC = () => {
	const { stats } = useAppContext();

	const services = stats?.services ? Object.entries(stats.services) : [];

	const calculatePercentage = (
		serviceRequests: number,
		totalRequests: number,
	): number => {
		if (totalRequests === 0) return 0;
		return (serviceRequests / totalRequests) * 100;
	};

	if (services.length === 0) {
		return (
			<div
				className={css({
					textAlign: "center",
					padding: "8",
					color: "gray.500",
					fontStyle: "italic",
				})}
			>
				{i18n.t("visitToStartTracking")}
			</div>
		);
	}

	return (
		<div
			className={css({
				backgroundColor: "gray.50",
				borderRadius: "lg",
				border: "1px solid",
				borderColor: "gray.200",
				padding: "4",
				marginBottom: "6",
			})}
		>
			<h2
				className={css({
					fontSize: "lg",
					fontFamily: "heading",
					fontWeight: "semibold",
					color: "gray.800",
					display: "flex",
					alignItems: "center",
					gap: "2",
					marginBottom: "3",
				})}
			>
				🔗 {i18n.t("serviceBreakdown")}
			</h2>

			<div
				className={css({
					display: "flex",
					flexDirection: "column",
					gap: "4",
				})}
			>
				{services.map(([serviceName, serviceStats]) => {
					const percentage = calculatePercentage(
						serviceStats.requests,
						stats.requests,
					);

					return (
						<div
							key={serviceName}
							className={css({
								backgroundColor: "white",
								borderRadius: "md",
								border: "1px solid",
								borderColor: "gray.200",
								padding: "3",
								display: "flex",
								flexDirection: "column",
								gap: "2",
							})}
						>
							<div
								className={css({
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: "2",
								})}
							>
								<h3
									className={css({
										fontSize: "md",
										fontWeight: "semibold",
										color: "gray.700",
										fontFamily: "heading",
									})}
								>
									{serviceName}
								</h3>
								<span
									className={css({
										fontSize: "xs",
										fontFamily: "numeric",
										color: "gray.600",
										fontWeight: "medium",
										backgroundColor: "gray.100",
										border: "1px solid",
										borderColor: "gray.200",
										borderRadius: "md",
										paddingX: "1.5",
										paddingY: "0.5",
									})}
								>
									{percentage.toFixed(1)}%
								</span>
							</div>

							<div
								className={css({
									display: "grid",
									gridTemplateColumns: "repeat(2, 1fr)",
									gap: "2",
								})}
							>
								<StatCard
									value={serviceStats.requests}
									label={`🌐 ${i18n.t("requests")}`}
								/>

								<StatCard
									value={formatCarbon(serviceStats.carbon)}
									label={`🌎 ${i18n.t("carbon")}`}
								/>

								<StatCard
									value={formatWater(serviceStats.water)}
									label={`💧 ${i18n.t("water")}`}
								/>

								<StatCard
									value={`${(serviceStats.totalDuration / 1000).toFixed(1)}s`}
									label={`⏳ ${i18n.t("duration")}`}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ServicesSection;
