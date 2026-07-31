<script lang="ts">
	import "./layout.css";
	import { configure } from "onedollarstats";
	import favicon from "$lib/assets/favicon.svg";
	import { ModeWatcher } from "mode-watcher";
	import Navbar from "$lib/components/navbar.svelte";
	import { SessionState, setSession } from "$lib/session.svelte";
	import type { LayoutProps } from "./$types";

	const { children, data }: LayoutProps = $props();

	// svelte-ignore state_referenced_locally
	let sessionState = new SessionState($state.snapshot(data.session));

	setSession(sessionState);

	$effect(() => {
		configure();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ModeWatcher />

<div class="min-h-screen bg-gray-950">
	<Navbar
		links={[
			{
				label: "home",
				to: "/"
			},
			{
				label: "music id list",
				to: "/music"
			},
			{
				label: "misc",
				to: "/misc"
			}
		]}
	/>

	<main class="mt-20 grow px-4 pt-2">
		{@render children()}
	</main>
</div>
