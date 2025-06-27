// postcss.config.cjs - Configuration PostCSS pour Extension Chrome avec Panda CSS

module.exports = {
	plugins: [
		// Plugin officiel Panda CSS (syntaxe array recommandée)
		require("@pandacss/dev/postcss")({
			// Configuration pour l'extraction complète
			include: ["./src/**/*.{ts,tsx}"],
			extract: true,
			hash: true,
		}),

		// Autoprefixer pour la compatibilité navigateur avec support backdrop-filter
		require("autoprefixer")(),

		// Optimisations CSS en production
		...(process.env.NODE_ENV === "production"
			? [
					require("cssnano")({
						preset: [
							"default",
							{
								discardComments: {
									removeAll: true,
								},
								normalizeWhitespace: true,
								calc: {
									precision: 2,
								},
								normalizeString: {
									preferredQuote: "single",
								},
								zindex: false,
							},
						],
					}),
				]
			: []),
	],
};
