<script lang="ts">
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import Header from "$lib/components/header.svelte";
	import type { LayoutProps } from "./$types";
	import { TooltipProvider } from "$lib/components/ui/tooltip";
	import { dehydrate, QueryClientProvider } from "@tanstack/svelte-query";
	import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
	import { browser } from "$app/environment";
	import { createDehydratedScript } from "$lib/utils/query";

	let { children, data }: LayoutProps = $props();
</script>

<svelte:head>
	{#if !browser}
		{@html createDehydratedScript(dehydrate(data.queryClient))}
	{/if}
</svelte:head>

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
