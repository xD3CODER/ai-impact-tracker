export const easingFunctions = {
	easeOut: (t: number) => 1 - (1 - t) ** 3,
	easeInOutQuart: (t: number) =>
		t < 0.5 ? 8 * t * t * t * t : 1 - (-2 * t + 2) ** 4 / 2,
	linear: (t: number) => t,
	easeOutCirc: (t: number): number => Math.sqrt(1 - (t - 1) ** 2),
	easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t)),
	easeOutCubic: (t: number): number => 1 - (1 - t) ** 3,

	easeInOutSine: (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2,
};

export type EasingFunctions = keyof typeof easingFunctions;
