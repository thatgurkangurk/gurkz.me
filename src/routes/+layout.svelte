<script lang="ts">
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import Header from "$lib/components/header.svelte";
	import type { LayoutProps } from "./$types";
	import { TooltipProvider } from "$lib/components/ui/tooltip";
	import { dehydrate, QueryClientProvider } from "@tanstack/svelte-query";
	import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";

	let { children, data }: LayoutProps = $props();
</script>

<QueryClientProvider client={data.queryClient}>
	<ModeWatcher />
	<Header />
	<main class="p-2">
		<TooltipProvider>
			{@render children()}
		</TooltipProvider>
	</main>
	<SvelteQueryDevtools />
</QueryClientProvider>
