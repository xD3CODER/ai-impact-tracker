import type React from "react";
import { css } from "styled-system/css";
import StatCard from "./StatCard";

export interface ImpactMessageCardProps {
	/** Array of impact messages to display */
	messages: string[];
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

const ImpactMessageCard: React.FC<ImpactMessageCardProps> = ({
	messages,
	className = "",
	dynamicColors,
}) => {
	const containerClasses = css({
		backgroundColor: "white",
		lineHeight: "1.4",
		textAlign: "center",
		marginBottom: "2",
		paddingX: "1",
	});

	const contentClasses = css({
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: "1",
	});

	const messageClasses = css({
		fontFamily: "subtitle",
		fontSize: "xs",
		textTransform: "capitalize",
		color: "primary.500",
		fontWeight: "lighter",
		lineHeight: "1.3",
	});

	return (
		<StatCard
			className={`${containerClasses} ${className}`}
			value={
				<div className={contentClasses}>
					{messages.map((message, index) => (
						<span key={index} className={messageClasses}>
							{message}
						</span>
					))}
				</div>
			}
			dynamicColors={dynamicColors}
		/>
	);
};

export default ImpactMessageCard;
