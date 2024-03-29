import { splitProps } from "solid-js";
import type { ComponentProps } from "solid-js";

import { cn } from "~/lib/utils";

export function Input(props: ComponentProps<"input">) {
	const [, rest] = splitProps(props, ["type", "class"]);
	return (
		<input
			type={props.type || "text"}
			class={cn(
				"border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 rounded-md border bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
				props.class,
			)}
			{...rest}
		/>
	);
}
