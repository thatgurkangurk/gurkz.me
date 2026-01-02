<script lang="ts">
	import "./layout.css";
	import { configure } from "onedollarstats";
	import favicon from "$lib/assets/favicon.svg";
	import { ModeWatcher } from "mode-watcher";
	import Navbar from "$lib/components/navbar.svelte";
	import { authClient } from "$lib/auth";
	import { SessionState, setSession } from "$lib/session.svelte";
	import type { LayoutProps } from "./$types";
	import { fromStore } from "svelte/store";

	const { children, data }: LayoutProps = $props();

	const rawSession = fromStore(authClient.useSession());

	// svelte-ignore state_referenced_locally
	let sessionState = new SessionState($state.snapshot(data.session));

	setSession(sessionState);

	$effect(() => {
		if (rawSession.current.isPending) return;
		sessionState.current = rawSession.current.data;
	});

	$effect(() => {
		configure();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ModeWatcher />

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

<div class="mt-20 w-full bg-amber-400 text-black">
	<p>
		hello! we are reorganising a bit, so some stuff may not exist, or may not work. thank you for
		your patience &lt;3
	</p>
</div>

<main class="grow px-4 pt-2">
	<!-- TODO: MAKE THIS MT-20 WHEN REMOVING THE NOTICE -->
	{@render children()}
</main>
