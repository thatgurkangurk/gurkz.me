<script lang="ts">
	import { TOOLS_MAP, type Tool, type ToolSlug } from "$lib/tools";
	import type { Snippet } from "svelte";
	import Meta from "./meta.svelte";
	import Button from "./ui/button/button.svelte";
	import LeftArrow from "virtual:icons/lucide/arrow-left";

	type Props = {
		tool: ToolSlug;
		children: Snippet<[Tool]>;
	};

	let { tool: slug, children }: Props = $props();

	const tool = TOOLS_MAP[slug];
</script>

<Meta title="{tool.title} - tools" />

<Button href="/tools"><LeftArrow /> back</Button>

{@render children(tool)}
