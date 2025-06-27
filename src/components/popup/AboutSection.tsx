import { useAppContext } from "@/context/AppContext";
import Icon from "@/icons/icon32.png";
import type React from "react";
import { css } from "styled-system/css";
import { actionButton } from "styled-system/patterns";

const AboutSection: React.FC = () => {
	const { onReset } = useAppContext();

	const appInfoContainerClasses = css({
		marginBottom: "4",
	});

	const appInfoHeaderClasses = css({
		display: "flex",
		alignItems: "center",
		gap: "3",
		marginBottom: "3",
	});

	const iconContainerClasses = css({
		padding: "2",
		backgroundColor: "green.50",
		borderRadius: "lg",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	});

	const iconClasses = css({
		width: "20px",
		height: "20px",
	});

	const appTitleClasses = css({
		fontSize: "sm",
		fontWeight: "semibold",
		color: "gray.900",
		margin: "0",
	});

	const versionClasses = css({
		fontSize: "xs",
		color: "gray.500",
		margin: "0",
		marginTop: "1",
	});

	const descriptionClasses = css({
		fontSize: "xs",
		color: "gray.600",
		lineHeight: "relaxed",
		margin: "0",
		marginBottom: "2",
	});

	const opensourceContainerClasses = css({
		display: "inline-flex",
	});

	const opensourceBadgeClasses = css({
		fontSize: "xs",
		color: "green.700",
		fontWeight: "medium",
	});

	const separatorClasses = css({
		height: "1px",
		backgroundColor: "gray.100",
		marginBottom: "4",
	});

	const resetSectionClasses = css({
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "3",
		columnGap: "1",
		borderRadius: "md",
		border: "1px solid",
		borderColor: "red.200",
	});

	const resetTitleClasses = css({
		fontSize: "sm",
		color: "red.500",
		margin: "0",
		marginBottom: "1",
	});

	const resetDescClasses = css({
		fontSize: "xs",
		color: "gray.500",
		margin: "0",
	});

	return (
		<div>
			{/* App information */}
			<div className={appInfoContainerClasses}>
				<div className={appInfoHeaderClasses}>
					<div className={iconContainerClasses}>
						<img src={Icon} alt="App icon" className={iconClasses} />
					</div>
					<div>
						<h3 className={appTitleClasses}>{i18n.t("appName")}</h3>
						<p className={versionClasses}>
							{i18n.t("version")} {browser.runtime.getManifest().version}
						</p>
					</div>
				</div>

				<p className={descriptionClasses}>{i18n.t("appInfoDesc")}</p>

				<div className={opensourceContainerClasses}>
					<span className={opensourceBadgeClasses}>
						{i18n.t("opensourceProject")}
					</span>
				</div>
			</div>

			{/* Separator */}
			<div className={separatorClasses} />

			{/* Reset section */}
			<div className={resetSectionClasses}>
				<div>
					<p className={resetTitleClasses}>{i18n.t("resetDataTitle")}</p>
					<p className={resetDescClasses}>{i18n.t("resetDataDesc")}</p>
				</div>

				<button
					type={"button"}
					className={actionButton({ variant: "danger-inverted", size: "sm" })}
					onClick={onReset}
				>
					{i18n.t("reset")}
				</button>
			</div>
		</div>
	);
};

export default AboutSection;
