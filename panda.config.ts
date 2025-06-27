import { defineConfig } from "@pandacss/dev";

export default defineConfig({
	// Whether to use css reset
	preflight: true,
	// Where to look for your css declarations
	include: ["./src/**/*.{js,jsx,ts,tsx}"],
	prefix: "ia",
	globalCss: {
		"html, body": {
			fontVariantNumeric: "slashed-zero",
		},
		":host": {
			fontVariantNumeric: "slashed-zero",
		},
		":host *": {
			fontVariantNumeric: "slashed-zero",
		},
	},
	theme: {
		extend: {
			tokens: {
				fonts: {
					body: {
						value:
							'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
					},
					heading: { value: "Courier New, serif" },
					subtitle: { value: "Courier New, serif" },
					numeric: { value: "monospace" },
				},
				spacing: {
					"0": { value: "0rem" },
					"0.5": { value: "0.125rem" },
					"1": { value: "0.25rem" },
					"1.5": { value: "0.375rem" },
					"2": { value: "0.5rem" },
					"2.5": { value: "0.625rem" },
					"3": { value: "0.75rem" },
					"3.5": { value: "0.875rem" },
					"4": { value: "1rem" },
					"5": { value: "1.25rem" },
					"6": { value: "1.5rem" },
					"7": { value: "1.75rem" },
					"8": { value: "2rem" },
					"9": { value: "2.25rem" },
					"10": { value: "2.5rem" },
					"12": { value: "3rem" },
					"16": { value: "4rem" },
					"20": { value: "5rem" },
					"24": { value: "6rem" },
					"32": { value: "8rem" },
					"40": { value: "10rem" },
					"48": { value: "12rem" },
					"56": { value: "14rem" },
					"64": { value: "16rem" },
				},

				colors: {
					primary: {
						50: { value: "#f8fafc" },
						100: { value: "#f1f5f9" },
						500: { value: "#475569" },
						600: { value: "#334155" },
						700: { value: "#1e293b" },
						800: { value: "#0f172a" },
						900: { value: "#020617" },
					},
					secondary: {
						500: { value: "#64748b" },
						600: { value: "#475569" },
						700: { value: "#334155" },
					},
					success: {
						50: { value: "#f0fdf4" },
						500: { value: "#22c55e" },
						700: { value: "#166534" },
					},
					warning: {
						50: { value: "#fefdf2" },
						500: { value: "#eab308" },
						700: { value: "#a16207" },
					},
					danger: {
						50: { value: "#fef2f2" },
						500: { value: "#ef4444" },
						700: { value: "#dc2626" },
					},
					accent: {
						50: { value: "#ffffff" },
						100: { value: "#f8fafc" },
						500: { value: "#000000" },
						600: { value: "#1e293b" },
						700: { value: "#0f172a" },
					},
				},

				shadows: {
					extension: { value: "0 8px 32px rgba(0, 0, 0, 0.1)" },
					floating: { value: "0 4px 12px rgba(0, 0, 0, 0.15)" },
					"floating-hover": { value: "0 6px 20px rgba(0, 0, 0, 0.2)" },
				},
			},

			semanticTokens: {
				colors: {
					"brand.gradient": {
						value:
							"linear-gradient(135deg, {colors.primary.800} 0%, {colors.primary.900} 100%)",
					},
					"brand.gradient.light": {
						value:
							"linear-gradient(135deg, {colors.primary.100} 0%, {colors.primary.50} 100%)",
					},

					"glass.background": { value: "rgba(255, 255, 255, 0.15)" },
					"glass.background.hover": { value: "rgba(255, 255, 255, 0.25)" },
					"glass.border": { value: "rgba(255, 255, 255, 0.2)" },
					"glass.border.hover": { value: "rgba(255, 255, 255, 0.4)" },
					"glass.content": { value: "rgba(255, 255, 255, 0.8)" },
					"glass.backdrop": { value: "rgba(0, 0, 0, 0.1)" },

					"glass.border.rainbow": { value: "rgba(147, 197, 253, 0.3)" },
					"glass.border.rainbow.hover": { value: "rgba(147, 197, 253, 0.5)" },
					"glass.border.success": { value: "rgba(34, 197, 94, 0.3)" },
					"glass.border.warning": { value: "rgba(251, 191, 36, 0.3)" },
					"glass.border.error": { value: "rgba(239, 68, 68, 0.3)" },

					"glass.content.rainbow": { value: "rgba(247, 250, 255, 0.85)" },
					"glass.content.success": { value: "rgba(248, 255, 250, 0.85)" },
					"glass.content.warning": { value: "rgba(255, 253, 247, 0.85)" },
					"glass.content.error": { value: "rgba(255, 248, 248, 0.85)" },

					"glass.shadow": { value: "0 8px 32px rgba(0, 0, 0, 0.37)" },
					"glass.shadow.strong": {
						value:
							"0 16px 64px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3)",
					},

					"glass.shadow.rainbow": {
						value:
							"0 0 20px rgba(147, 197, 253, 0.2), 0 0 40px rgba(147, 197, 253, 0.1)",
					},
					"glass.shadow.success": {
						value:
							"0 0 20px rgba(34, 197, 94, 0.2), 0 0 40px rgba(34, 197, 94, 0.1)",
					},
					"glass.shadow.warning": {
						value:
							"0 0 20px rgba(251, 191, 36, 0.2), 0 0 40px rgba(251, 191, 36, 0.1)",
					},
					"glass.shadow.error": {
						value:
							"0 0 20px rgba(239, 68, 68, 0.2), 0 0 40px rgba(239, 68, 68, 0.1)",
					},

					"impact.low.bg": { value: "{colors.success.50}" },
					"impact.low.text": { value: "{colors.success.700}" },
					"impact.medium.bg": { value: "{colors.warning.50}" },
					"impact.medium.text": { value: "{colors.warning.700}" },
					"impact.high.bg": { value: "{colors.danger.50}" },
					"impact.high.text": { value: "{colors.danger.700}" },
				},
			},

			keyframes: {
				spin: {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" },
				},
				slideIn: {
					"0%": { opacity: "0", transform: "translateY(-10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				slideInUp: {
					"0%": { opacity: "0", transform: "translateY(20px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				pulse: {
					"0%": { opacity: "0.7" },
					"50%": { opacity: "1" },
					"100%": { opacity: "0.7" },
				},
				slideInScale: {
					"0%": {
						opacity: "0",
						transform: "translate(-50%, -50%) scale(0.3) rotate(-180deg)",
					},
					"50%": {
						transform: "translate(-50%, -50%) scale(1.1) rotate(-10deg)",
					},
					"100%": {
						opacity: "1",
						transform: "translate(-50%, -50%) scale(1) rotate(0deg)",
					},
				},
				slideOutScale: {
					"0%": {
						opacity: "0.8",
						transform: "translate(-50%, -50%) scale(1) rotate(0deg)",
					},
					"100%": {
						opacity: "0",
						transform: "translate(-50%, -50%) scale(0.3) rotate(180deg)",
					},
				},
			},
		},
	},

	conditions: {
		extend: {
			hover: "&:hover",
			focus: "&:focus",
			active: "&:active",
			checked: "&:checked",
			disabled: "&:disabled",
			popup: '[data-context="popup"] &',
			content: '[data-context="content"] &',
		},
	},

	patterns: {
		extend: {
			statCard: {
				description: "A card pattern for statistics display",
				properties: {
					variant: { type: "enum", value: ["default", "highlighted"] },
				},
				defaultValues: { variant: "default" },
				transform(props: any) {
					return {
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						padding: "3",
						borderRadius: "lg",
						border: "1px solid",
						borderColor: "gray.200",
						backgroundColor:
							props.variant === "highlighted" ? "primary.50" : "gray.50",
						transition: "all 0.2s ease",
						_hover: {
							backgroundColor:
								props.variant === "highlighted" ? "primary.100" : "gray.100",
							transform: "translateY(-1px)",
						},
					};
				},
			},

			actionButton: {
				description: "Extension action button pattern",
				properties: {
					size: { type: "enum", value: ["sm", "md", "lg"] },
					variant: {
						type: "enum",
						value: ["primary", "secondary", "danger", "danger-inverted"],
					},
				},
				defaultValues: { size: "md", variant: "primary" },
				transform(props: any) {
					const sizeStyles = {
						sm: { padding: "2", fontSize: "xs" },
						md: { padding: "3", fontSize: "sm" },
						lg: { padding: "4", fontSize: "base" },
					};

					const variantStyles = {
						primary: {
							background: "{colors.brand.gradient}",
							color: "white",
							border: "none",
						},
						secondary: {
							backgroundColor: "gray.100",
							color: "gray.700",
							border: "none",
						},
						danger: {
							backgroundColor: "danger.500",
							color: "white",
							border: "none",
						},
						"danger-inverted": {
							color: "danger.500",
							backgroundColor: "white",
							border: "1px solid",
							borderColor: "danger.500",
						},
					};

					return {
						...(sizeStyles[props.size as keyof typeof sizeStyles] ||
							sizeStyles.md),
						...(variantStyles[props.variant as keyof typeof variantStyles] ||
							variantStyles.primary),
						borderRadius: "md",
						cursor: "pointer",
						fontWeight: "semibold",
						transition: "all 0.2s ease",
						_hover: {
							transform: "translateY(-1px)",
							...(props.variant === "primary" && {
								background: "{colors.brand.gradient.light}",
								color: "black",
							}),
							...(props.variant === "danger-inverted" && {
								backgroundColor: "danger.50",
								borderColor: "danger.600",
								color: "danger.700",
							}),
						},
					};
				},
			},

			sectionCard: {
				description: "Section card pattern for settings/info pages",
				properties: {
					color: { type: "string" },
					border: { type: "string" },
				},
				defaultValues: { color: "gray.50", border: "gray.200" },
				transform(props: any) {
					return {
						backgroundColor: props.color,
						border: "1px solid",
						borderColor: props.border,
						borderRadius: "lg",
						padding: "5",
						marginBottom: "6",
						boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
					};
				},
			},

			sectionHeader: {
				description: "Section header pattern for card titles",
				properties: {
					size: { type: "enum", value: ["md", "lg", "xl"] },
					color: { type: "string" },
				},
				defaultValues: { size: "md", color: "gray.800" },
				transform(props: any) {
					const sizes = { md: "1.1rem", lg: "1.3rem", xl: "1.6rem" };
					return {
						fontSize: sizes[props.size as keyof typeof sizes] || sizes.md,
						fontWeight: "semibold",
						marginBottom: "3",
						color: props.color,
						display: "flex",
						alignItems: "center",
						gap: "2",
					};
				},
			},
		},
	},

	outdir: "styled-system",

	outExtension: "mjs",

	hash: true,
});
