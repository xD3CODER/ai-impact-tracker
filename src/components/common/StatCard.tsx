import type React from "react";
import { css, cx } from "styled-system/css";

export interface StatCardProps {
	/** Main value to display */
	value: string | number | React.ReactNode;
	/** Statistic label */
	label?: string;
	/** Custom CSS class (optional) */
	className?: string;
	/** Dynamic colors to apply (optional) */
	dynamicColors?: {
		backgroundColor?: string;
		borderColor?: string;
		borderColorHover?: string;
		boxShadow?: string;
	};
}

const StatCard: React.FC<StatCardProps> = ({
	value,
	label,
	className = "",
	dynamicColors,
}) => {
	const containerClasses = css({
		background: "gray.50",
		padding: "4",
		borderRadius: "lg",
		textAlign: "center",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		border: "1px solid",
		borderColor: "gray.200",
		transition: "all 0.3s ease",
		_hover: {
			borderColor: "gray.300",
		},
	});

	const valueClasses = css({
		fontSize: "md",
		fontWeight: "bold",
		marginBottom: "1",
		color: "primary.500",
		fontFamily: "numeric",
		fontVariantNumeric: "tabular-nums",
	});

	const labelClasses = css({
		fontSize: "xs",
		color: "gray.500",
		fontFamily: "subtitle",
		letterSpacing: "normal",
		textTransform: "uppercase",
		fontWeight: "normal",
		textAlign: "center",
	});

	// Combine dynamic colors with base styles
	const dynamicStyle = dynamicColors
		? {
				backgroundColor: dynamicColors.backgroundColor,
				borderColor: dynamicColors.borderColor,
				boxShadow: dynamicColors.boxShadow,
			}
		: {};

	return (
		<div className={cx(containerClasses, className)} style={dynamicStyle}>
			<div className={valueClasses}>{value}</div>
			{label && <div className={labelClasses}>{label}</div>}
		</div>
	);
};

export default StatCard;
