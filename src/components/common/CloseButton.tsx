import type React from "react";
import { css, cx } from "styled-system/css";

// Styles du bouton de fermeture avec animations

interface DynamicColors {
	borderColor: string;
	borderColorHover: string;
	backgroundColor: string;
	boxShadow: string;
}

interface CloseButtonProps {
	isVisible: boolean;
	onClick: (e: React.MouseEvent) => void;
	dynamicColors: DynamicColors;
}

const CloseButton: React.FC<CloseButtonProps> = ({
	isVisible,
	onClick,
	dynamicColors,
}) => {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onClick(e as unknown as React.MouseEvent);
		}
	};

	const containerClasses = css({
		position: "absolute",
		top: "-12px",
		left: "-12px",
		width: "34px",
		height: "34px",
		borderRadius: "50%",
		zIndex: 99,
		pointerEvents: "auto",
		_hover: {
			cursor: "pointer",
		},
	});

	const buttonClasses = css({
		position: "relative",
		width: "22px",
		height: "22px",
		borderRadius: "50%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		left: "50%",
		top: "50%",
		cursor: "pointer",
		fontSize: "18px",
		fontWeight: "bold",
		zIndex: 100,
		transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
		background: "rgba(240, 240, 240, 0.8)",
		color: "black",
		borderWidth: "2px",
		transform: "translate(-50%, -50%)",
		shadow: "md",
		opacity: 0,
		pointerEvents: "none",
		"&.visible": {
			opacity: 0.8,
			pointerEvents: "auto",
			animation: "slideInScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
		},
		"&.hidden": {
			opacity: 0,
			pointerEvents: "none",
		},
		"&.hidden.animate-out": {
			animation: "slideOutScale 0.3s ease-in forwards",
		},
		_hover: {
			transform: "translate(-50%, -50%) scale(1.3)",
			background: "rgba(255, 255, 255, 0.9)",
			opacity: 1,
			cursor: "pointer",
		},
		"&:active": {
			background: "rgba(67, 74, 88, 0.9)",
			transform: "translate(-50%, -50%) scale(1.1)",
			transition: "all 0.1s ease-out",
		},
	});

	const svgClasses = css({
		filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))",
	});

	return (
		<div className={containerClasses}>
			<button
				type="button"
				className={cx(buttonClasses, isVisible ? "visible" : "hidden")}
				onClick={onClick}
				onKeyDown={handleKeyDown}
				data-testid="close-button"
				title={i18n.t("closeOverlay")}
				style={{ borderColor: dynamicColors.borderColor }}
				aria-label={i18n.t("closeOverlay")}
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="currentColor"
					className={svgClasses}
				>
					<path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
				</svg>
			</button>
		</div>
	);
};

export default CloseButton;
