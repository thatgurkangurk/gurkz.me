<script lang="ts">
	import "../app.css";
	import { page } from "$app/stores";
	import { ModeWatcher } from "mode-watcher";
	import Navbar from "$lib/components/navbar.svelte";
	import SpaceGrotesk from "$lib/fonts/SpaceGroteskVariable.woff2";
	import { Toaster } from "$lib/components/ui/sonner";
	import { setUser } from "$lib/auth/store";
	import type { LayoutServerData } from "./$types";

	export let data: LayoutServerData;

	$: {
		setUser(data.user);
	}
</script>

<ModeWatcher />
<link rel="preload" as="font" type="font/woff2" crossorigin="anonymous" href={SpaceGrotesk} />

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
