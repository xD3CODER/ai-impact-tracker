import type React from "react";
import { css } from "styled-system/css";
import { sectionHeader } from "styled-system/patterns";

interface PrivacyInfoCardProps {
	title: string;
	children: React.ReactNode;
}

const PrivacyInfoCard: React.FC<PrivacyInfoCardProps> = ({
	title,
	children,
}) => {
	const cardContainerClasses = css({
		display: "flex",
		alignItems: "flex-start",
		gap: "3",
		marginBottom: "4",
	});

	const cardTitleClasses = css({
		fontSize: "md",
		fontWeight: "semibold",
		color: "green.700",
	});

	const cardContentClasses = css({
		fontSize: "sm",
		color: "gray.600",
	});

	return (
		<div className={cardContainerClasses}>
			<div>
				<h4 className={cardTitleClasses}>{title}</h4>
				<p className={cardContentClasses}>{children}</p>
			</div>
		</div>
	);
};

const PrivacyInfoSection: React.FC = () => {
	const sectionContainerClasses = css({
		marginTop: "4",
		marginBottom: "4",
	});

	const introTextClasses = css({
		fontSize: "sm",
		color: "gray.600",
		marginBottom: "6",
		lineHeight: "1.6",
	});

	return (
		<>
			<h2 className={sectionHeader({ size: "md", color: "gray.800" })}>
				{i18n.t("howItWorks")}
			</h2>
			<div className={sectionContainerClasses}>
				<p className={introTextClasses}>{i18n.t("privacyFirst")}</p>

				<PrivacyInfoCard title={i18n.t("dataStaysLocal")}>
					{i18n.t("dataStaysLocalDesc")}
				</PrivacyInfoCard>

				<PrivacyInfoCard title={i18n.t("noContentAccess")}>
					{i18n.t("noContentAccessDesc")}
				</PrivacyInfoCard>

				<PrivacyInfoCard title={i18n.t("transparentTech")}>
					{i18n.t("transparentTechDesc")}
				</PrivacyInfoCard>
			</div>
		</>
	);
};

export default PrivacyInfoSection;
