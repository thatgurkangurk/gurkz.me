<script lang="ts">
	import { Toaster } from "$lib/components/ui/sonner";
	import Nav from "$lib/components/nav.svelte";
	import ViewTransitions from "$lib/components/view-transitions.svelte";
	import { ModeWatcher } from "mode-watcher";
	import "../app.css";
	import { QueryClientProvider } from "@tanstack/svelte-query";
	import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
	import { partytownSnippet } from "@qwik.dev/partytown/integration";

	let { children, data } = $props();

	const snippet = `<script>${partytownSnippet()}<\/script>`;
</script>

<svelte:head>
	{@html snippet}
	<script type="text/partytown" defer src="https://assets.onedollarstats.com/stonks.js"></script>
</svelte:head>

<QueryClientProvider client={data.queryClient}>
	<Toaster />
	<ModeWatcher />
	<ViewTransitions />
	<Nav />
	<main class="p-2">
		{@render children()}
	</main>
	<SvelteQueryDevtools />
</QueryClientProvider>
