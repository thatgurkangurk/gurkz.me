<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import Header from "$lib/components/header.svelte";
	import "../app.css";
	import type { LayoutProps } from "./$types";
	import { TooltipProvider } from "$lib/components/ui/tooltip";

	let { children }: LayoutProps = $props();
</script>

<ModeWatcher />
<Header />
<main class="p-2">
	<TooltipProvider>
		{@render children()}
	</TooltipProvider>
</main>
