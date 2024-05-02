<script lang="ts">
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import Navbar from "$lib/components/navbar.svelte";
	import SpaceGrotesk from "$lib/fonts/SpaceGroteskVariable.woff2";
	import { Toaster } from "$lib/components/ui/sonner";
</script>

<ModeWatcher />
<link rel="preload" as="font" type="font/woff2" crossorigin="anonymous" href={SpaceGrotesk} />

<div class="min-h-[100dvh] w-full flex flex-col">
	<Toaster />
	<Navbar />

	<main class="p-2 flex-grow">
		<slot />
	</main>
</div>
