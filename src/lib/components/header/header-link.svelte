<script lang="ts" module>
	import type { Snippet } from "svelte";
	import type { ClassValue } from "svelte/elements";
	import { cva } from "class-variance-authority";

	export type HeaderLinkProps = {
		href: string;
		label: string;
		inSheet?: boolean;
		onclick?: () => void;
	};
</script>

<script lang="ts">
	import { page } from "$app/state";
	import { cn } from "$lib/utils";

	const linkVariants = cva("transition-colors duration-200 px-3 py-2 rounded-md text-base", {
		variants: {
			variant: {
				sheet: "",
				outside: ""
			},
			state: {
				active: "",
				inactive: ""
			}
		},
		compoundVariants: [
			{
				variant: "sheet",
				state: "active",
				className: "text-primary font-medium bg-primary/10"
			},
			{
				variant: "sheet",
				state: "inactive",
				className: "text-foreground hover:text-primary hover:bg-accent"
			},
			{
				variant: "outside",
				state: "active",
				className: "text-primary font-medium"
			},
			{
				variant: "outside",
				state: "inactive",
				className: "text-muted-foreground hover:text-foreground"
			}
		]
	});

	let { href, inSheet, label, ...props }: HeaderLinkProps = $props();
	let isActive = $derived(page.url.pathname === href);
	let variant = $derived<"sheet" | "outside">(inSheet ? "sheet" : "outside");
</script>

<a
	{...props}
	class={[
		isActive && cn(linkVariants({ variant, state: "active" })),
		!isActive && cn(linkVariants({ variant, state: "inactive" }))
	]}
	{href}
>
	{label}
</a>
