<script lang="ts">
	import "../app.css";
	import "$lib/nprogress.css";
	import { page } from "$app/stores";
	import { ModeWatcher } from "mode-watcher";
	import Navbar from "$lib/components/navbar.svelte";
	import SpaceGrotesk from "$lib/fonts/SpaceGroteskVariable.woff2";
	import { Toaster } from "$lib/components/ui/sonner";
	import { setUser } from "$lib/auth/store";
	import type { LayoutData } from "./$types";
	import { QueryClientProvider } from "@tanstack/svelte-query";
	import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
	import { navigating } from "$app/stores";
	import nProgress from "nprogress";

	export let data: LayoutData;

	nProgress.configure({
		minimum: 0.16,
		trickle: true
	});

	$: {
		setUser(data.user);

		if ($navigating) {
			nProgress.start();
		}

		if (!$navigating) {
			nProgress.done();
		}
	}
</script>

<ModeWatcher />
<link rel="preload" as="font" type="font/woff2" crossorigin="anonymous" href={SpaceGrotesk} />
<QueryClientProvider client={data.queryClient}>
	{#if $page.route.id === "/project/still-alive"}
		<Toaster />
		<Navbar />
		<slot />
	{:else}
		<div class="min-h-[100dvh] w-full flex flex-col">
			<Toaster />
			<Navbar />

			<main class="p-2 flex-grow">
				<slot />
			</main>
		</div>
	{/if}
	<SvelteQueryDevtools />
</QueryClientProvider>
