<script lang="ts">
	import { page } from "$app/state";
	import type { Link } from "./link";

	type Props = {
		onclick?: () => void;
	} & Link;

	let { href, text, alwaysActive = false, onclick }: Props = $props();

	let isActive = $derived(page.url.pathname === href || alwaysActive);
</script>

<a
	{href}
	{onclick}
	class={`flex items-center gap-2 font-semibold ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
>
	{text}
</a>
