import { getAllProviders } from "@/utils/providers/detection";
import type React from "react";
import { css } from "styled-system/css";
import { sectionHeader } from "styled-system/patterns";

const ProvidersList: React.FC = () => (
	<>
		<h2 className={sectionHeader({ size: "md", color: "gray.800" })}>
			{i18n.t("supportedProviders")}
		</h2>
		<ul
			className={css({
				listStyle: "none",
				margin: 0,
				padding: 0,
			})}
		>
			{getAllProviders().map((provider) => (
				<li
					key={provider.id}
					className={css({
						padding: "3",
						borderBottom: "1px solid",
						borderBottomColor: "gray.200",
						_last: { borderBottom: "none" },
						display: "block",
					})}
				>
					<div className={css({ marginBottom: "2" })}>
						<div className={css({ fontWeight: "medium", fontSize: "sm" })}>
							{provider.name}
						</div>
						<div className={css({ color: "gray.500", fontSize: "xs" })}>
							{provider.hostnames.join(", ")}
						</div>
					</div>
					<div
						className={css({
							display: "flex",
							flexDirection: "column",
							fontSize: "xs",
							marginTop: "2",
						})}
					>
						<span className={css({ color: "gray.600", fontWeight: "medium" })}>
							{i18n.t("sources")}
						</span>
						<span className={css({ color: "gray.500" })}>
							{provider.metrics.sources.map((source, index) => (
								<span key={index} className={css({ display: "list-item" })}>
									{source}
								</span>
							))}
						</span>
					</div>
				</li>
			))}
		</ul>
	</>
);

export default ProvidersList;
