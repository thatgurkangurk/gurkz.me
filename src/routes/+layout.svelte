<script lang="ts">
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import type { LayoutProps } from "./$types";
	import Nav from "$lib/components/nav/nav.svelte";
	import { Toaster } from "$lib/components/ui/sonner";
	let { children, data }: LayoutProps = $props();
</script>

<ModeWatcher />
<Toaster />

<div class="flex flex-col min-h-screen">
	<Nav />
	<div class="flex-grow min-h-[83dvh] w-full flex flex-col">
		<main class="flex-grow p-2">
			{@render children()}
		</main>
	</div>
</div>
