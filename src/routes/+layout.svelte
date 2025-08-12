<script lang="ts">
	import Nav from "$lib/components/nav.svelte";
	import ViewTransitions from "$lib/components/view-transitions.svelte";
	import { ModeWatcher } from "mode-watcher";
	import "../app.css";
	import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
	import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
	import { browser } from "$app/environment";

	let { children, data } = $props();
</script>

<QueryClientProvider client={data.queryClient}>
	<ModeWatcher />
	<ViewTransitions />
	<Nav />
	<main class="p-2">
		{@render children()}
	</main>
	<SvelteQueryDevtools />
</QueryClientProvider>
