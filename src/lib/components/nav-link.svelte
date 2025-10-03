<script lang="ts" module>
	import type { Snippet } from "svelte";
	import type { ClassValue } from "svelte/elements";

	export type NavLinkProps = {
		href: string;
		class?: ClassValue;
		activeClass?: ClassValue;
		inactiveClass?: ClassValue;
		children: Snippet;
	};
</script>

<script lang="ts">
	import { page } from "$app/state";

	let { activeClass, href, inactiveClass, class: clazz, children }: NavLinkProps = $props();
	let isActive = $derived(page.url.pathname === href);
</script>

<a class={[clazz, isActive && activeClass, !isActive && inactiveClass]} {href}>
	{@render children()}
</a>
