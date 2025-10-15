<script lang="ts">
	import "@fontsource-variable/dm-sans";
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import Header from "$lib/components/header/header.svelte";
	import type { LayoutProps } from "./$types";
	import { TooltipProvider } from "$lib/components/ui/tooltip";
	import { Toaster } from "$lib/components/ui/sonner/index.js";

	let { children, data }: LayoutProps = $props();
</script>

<ModeWatcher />
<Header />
<Toaster />
<main class="p-2">
	<TooltipProvider>
		{@render children()}
	</TooltipProvider>
</main>
