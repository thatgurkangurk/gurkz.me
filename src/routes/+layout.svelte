<script lang="ts">
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import type { LayoutProps } from "./$types";
	import Nav from "$lib/components/nav/nav.svelte";
	import { Toaster } from "$lib/components/ui/sonner";
	import { page } from "$app/state";
	import { setTimeoutState } from "$lib/utils/timeouts.svelte";
	let { children, data }: LayoutProps = $props();

	setTimeoutState();
</script>

<ModeWatcher />
<Toaster />

<svelte:head>
	<title>{page.data.meta?.title ?? "gurkan's website"}</title>
</svelte:head>

<div class="flex flex-col min-h-screen">
	<Nav />
	<div class="flex-grow min-h-[83dvh] w-full flex flex-col">
		<main class="flex-grow p-2">
			{@render children?.()}
		</main>
	</div>
</div>
