<script lang="ts">
	import "@fontsource-variable/dm-sans";
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import Header from "$lib/components/header/header.svelte";
	import type { LayoutProps } from "./$types";
	import { TooltipProvider } from "$lib/components/ui/tooltip";
	import { dehydrate, QueryClientProvider } from "@tanstack/svelte-query";
	import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
	import { Toaster } from "$lib/components/ui/sonner/index.js";

	let { children, data }: LayoutProps = $props();
</script>

<QueryClientProvider client={data.queryClient}>
	<ModeWatcher />
	<Header />
	<Toaster />
	<main class="p-2">
		<TooltipProvider>
			{@render children()}
		</TooltipProvider>
	</main>
	<SvelteQueryDevtools />
</QueryClientProvider>
