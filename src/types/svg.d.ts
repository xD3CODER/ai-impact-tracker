declare module "*.svg" {
	const content: string;
	export default content;
}

declare module "*.svg?url" {
	const content: string;
	export default content;
}

declare module "*.svg?component" {
	import type React from "react";
	const component: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
	export default component;
}
