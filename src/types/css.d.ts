// Déclarations TypeScript pour les imports CSS
declare module "*.css" {
	const content: string;
	export default content;
}

declare module "*.scss" {
	const content: string;
	export default content;
}

declare module "*.sass" {
	const content: string;
	export default content;
}

declare module "*.less" {
	const content: string;
	export default content;
}

// Déclarations pour les modules Panda CSS
declare module "styled-system/*" {
	const content: any;
	export default content;
}
