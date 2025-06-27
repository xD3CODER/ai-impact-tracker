declare module "*.svg" {
	import type React from "react";
	const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
	export default SVG;
}

declare module "*.png" {
	const content: string;
	export default content;
}

declare module "*.jpg" {
	const content: string;
	export default content;
}

declare module "*.jpeg" {
	const content: string;
	export default content;
}

declare module "*.gif" {
	const content: string;
	export default content;
}

declare module "*.webp" {
	const content: string;
	export default content;
}

declare module "*.avif" {
	const content: string;
	export default content;
}

declare module "*.ico" {
	const content: string;
	export default content;
}
