import type React from "react";
import { css } from "styled-system/css";

interface ToggleRowProps {
	label: string;
	description?: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({
	label,
	description,
	checked,
	onChange,
}) => {
	const containerClasses = css({
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "3",
		backgroundColor: "white",
		borderRadius: "md",
		border: "1px solid",
		borderColor: "gray.100",
	});

	const contentClasses = css({
		flex: 1,
	});

	const labelClasses = css({
		fontSize: "sm",
		fontWeight: "medium",
		color: "gray.700",
		display: "block",
	});

	const labelWithDescriptionClasses = css({
		fontSize: "sm",
		fontWeight: "medium",
		color: "gray.700",
		display: "block",
		marginBottom: "1",
	});

	const descriptionClasses = css({
		fontSize: "xs",
		color: "gray.500",
	});

	const toggleLabelClasses = css({
		position: "relative",
		display: "inline-block",
		width: "12",
		height: "6",
		cursor: "pointer",
	});

	const hiddenInputClasses = css({
		opacity: 0,
		width: 0,
		height: 0,
		position: "absolute",
	});

	const toggleSliderClasses = css({
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		borderRadius: "full",
		transition: "all 0.3s ease",
		_before: {
			content: '""',
			position: "absolute",
			height: "5",
			width: "5",
			bottom: "0.5",
			backgroundColor: "white",
			borderRadius: "full",
			transition: "all 0.3s ease",
			boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
		},
	});

	const toggleSliderCheckedClasses = css({
		backgroundColor: "green.500",
		_before: {
			left: "6",
		},
	});

	const toggleSliderUncheckedClasses = css({
		backgroundColor: "gray.300",
		_before: {
			left: "0.5",
		},
	});

	return (
		<div className={containerClasses}>
			<div className={contentClasses}>
				<span
					className={description ? labelWithDescriptionClasses : labelClasses}
				>
					{label}
				</span>
				{description && (
					<span className={descriptionClasses}>{description}</span>
				)}
			</div>
			<label className={toggleLabelClasses}>
				<input
					type="checkbox"
					checked={checked}
					onChange={(e) => onChange(e.target.checked)}
					className={hiddenInputClasses}
				/>
				<span
					className={`${toggleSliderClasses} ${
						checked ? toggleSliderCheckedClasses : toggleSliderUncheckedClasses
					}`}
				/>
			</label>
		</div>
	);
};

export default ToggleRow;
