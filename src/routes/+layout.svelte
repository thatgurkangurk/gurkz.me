<script lang="ts">
	import { Nav } from "$lib/components/nav";
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import type { Snippet } from "svelte";

	type Props = {
		children: Snippet<[]>;
	};

	let { children }: Props = $props();
</script>

<ModeWatcher defaultMode="system" />

<div class="flex flex-col min-h-screen">
	<Nav />
	<div class="flex-grow min-h-[83dvh] w-full flex flex-col">
		<main class="flex-grow p-2">
			{@render children()}
		</main>
	</div>
</div>
