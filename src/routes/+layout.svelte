<script lang="ts">
	import "./layout.css";
	import { configure } from "onedollarstats";
	import favicon from "$lib/assets/favicon.svg";
	import { ModeWatcher } from "mode-watcher";
	import Navbar from "$lib/components/navbar.svelte";
	import { SessionState, setSession } from "$lib/session.svelte";
	import type { LayoutProps } from "./$types";

	import "vanilla-cookieconsent/dist/cookieconsent.css";
	import { run } from "$lib/cookie-consent.js";

	const { children, data }: LayoutProps = $props();

	// svelte-ignore state_referenced_locally
	let sessionState = new SessionState($state.snapshot(data.session));

	setSession(sessionState);

	$effect(() => {
		run({
			language: {
				default: "en",
				translations: {
					en: "/en.json"
				}
			},
			categories: {
				preferences: {
					enabled: true,
					autoClear: {
						cookies: [
							{
								name: "id_format",
								path: "/"
							}
						]
					}
				}
			}
		});
	});

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
				label: "ttcore",
				to: "/ttcore"
			},
			{
				label: "misc",
				to: "/misc"
			}
		]}
	/>

	<main class="mt-20 grow px-4 pt-2" data-vaul-drawer-wrapper>
		{@render children()}
	</main>
</div>
