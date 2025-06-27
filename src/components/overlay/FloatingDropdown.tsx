import AnimatedLoadingCounter from "@/components/common/AnimatedLoadingCounter";
import CloseButton from "@/components/common/CloseButton";
import FloatingDropdownPanel from "./FloatingDropdownPanel";
import { useFloatingDropdownData } from "@/hooks/useFloatingDropdownData";
import type { Provider } from "@/types/provider";
import { formatCarbon, formatWater } from "@/utils/formatting/display";
import type React from "react";
import { useRef } from "react";
import { css } from "styled-system/css";

interface FloatingDropdownProps {
	provider: Provider;
	isOpen: boolean;
	onToggle: () => void;
	onOpenGlobal?: () => void;
}

const FloatingDropdown: React.FC<FloatingDropdownProps> = ({
	provider,
	isOpen,
	onToggle,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const data = useFloatingDropdownData(provider, isOpen);

	const {
		dropdownState,
		isRequestActive,
		serviceStats,
		dynamicColors,
		providerMinValues,
		handleContainerClick,
		handleContainerHover,
	} = data;

	// CSS classes for styling
	const floatingContainerClasses = css({
		zIndex: 1000000,
		position: "relative",
	});

	const mainContainerClasses = css({
		position: "fixed",
		top: "5",
		right: "5",
		pointerEvents: "auto",
		transition: "transform 0.3s ease-in-out",
	});

	const hoverContainerClasses = css({
		transition: "all 0.3s ease",
		_hover: {
			transform: dropdownState.isHidden ? "none" : "scale(0.95)",
		},
	});

	const animatedSvgClasses = css({
		position: "absolute",
		top: "0px",
		left: "0px",
		borderRadius: "8px",
		width: "calc(100%)",
		height: "calc(100%)",
		pointerEvents: "none",
		zIndex: 9999,
	});

	const buttonClasses = css({
		position: "relative",
		border: "4px solid",
		backdropFilter: "auto",
		backdropBlur: "sm",
		transition: "transform 0.5s ease-in-out",
		shadow: "md",
		fontSize: "xs",
		borderRadius: "8px",
		fontWeight: "bold",
		overflow: "hidden",
		display: "flex",
		alignItems: "center",
		color: "gray.800",
		_hover: {
			cursor: "pointer",
		},
	});

	const buttonContentClasses = css({
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		columnGap: "2",
		borderRadius: "4px",
		border: "1px solid #ffffff66",
		paddingX: "4",
		paddingY: "2",
		position: "relative",
		zIndex: 1,
	});

	const hiddenButtonClasses = css({
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
		fontWeight: "bold",
		left: "0",
		top: "0",
		bottom: "0",
		zIndex: 5,
		color: "primary.500",
	});

	return (
		<div className={floatingContainerClasses} id={"floating"}>
			<section
				ref={containerRef}
				className={mainContainerClasses}
				style={{
					transform: dropdownState.isHidden
						? "translateX(calc(100%))"
						: "translateX(0)",
				}}
				onMouseEnter={() => handleContainerHover(true)}
				onMouseLeave={() => handleContainerHover(false)}
				aria-label="Carbon tracker dropdown"
			>
				{/* Use CloseButton component */}
				{!dropdownState.isHidden && !isOpen && (
					<CloseButton
						dynamicColors={dynamicColors}
						isVisible={dropdownState.showCloseButton}
						onClick={handleContainerClick}
					/>
				)}
				<div className={hoverContainerClasses}>
					{isRequestActive && (
						<svg className={animatedSvgClasses}>
							<rect
								x="1"
								y="1"
								width="calc(100% - 2px)"
								height="calc(100% - 2px)"
								rx="1"
								ry="1"
								fill="none"
								stroke={dynamicColors.borderColorHover}
								strokeWidth="2"
								pathLength={1000}
								strokeLinecap={"round"}
								style={{
									filter: "blur(2px)",
									animation: "svg-acceleration-trail 2s linear infinite",
								}}
							/>
						</svg>
					)}
					<button
						type="button"
						className={buttonClasses}
						onClick={dropdownState.isHidden ? handleContainerClick : onToggle}
						style={
							{
								borderColor: dynamicColors.borderColor,
								pointerEvents: "auto",
								zIndex: 20,
								"--hover-border-color": dynamicColors.borderColorHover,
								minWidth: dropdownState.isHidden ? "30px" : "140px",
								width: dropdownState.isHidden ? "30px" : "auto",
								height: "auto",
								justifyContent: dropdownState.isHidden
									? "center"
									: "flex-start",
							} as React.CSSProperties
						}
					>
						<span
							className={buttonContentClasses}
							style={{
								background: dynamicColors.backgroundColor,
							}}
						>
							{dropdownState.isHidden ? (
								<span id={"dropdown"} className={hiddenButtonClasses}>
									&#10094;
								</span>
							) : (
								<>
									{/* 🎯 ANIMATED CARBON */}
									<AnimatedLoadingCounter
										realValue={serviceStats.carbon}
										isLoading={isRequestActive}
										minValueForLoading={providerMinValues.carbon}
										formatValue={(value: number) => formatCarbon(value)}
									/>
									⚡<span className={css({ color: "primary.500" })}>•</span>
									{/* 🎯 ANIMATED WATER */}
									<AnimatedLoadingCounter
										realValue={serviceStats.water}
										isLoading={isRequestActive}
										minValueForLoading={providerMinValues.water}
										formatValue={(value: number) => formatWater(value)}
									/>
									💧
								</>
							)}
						</span>
					</button>
				</div>

				{/* Separated dropdown panel */}
				<FloatingDropdownPanel
					provider={provider}
					dropdownState={dropdownState}
					serviceStats={serviceStats}
					dynamicColors={dynamicColors}
				/>
			</section>
		</div>
	);
};

export default FloatingDropdown;
