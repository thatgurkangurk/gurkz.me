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
	import { untrack } from "svelte";
	import { Toaster } from "svelte-sonner";

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
			autoClearCookies: true,
			categories: {
				preferences: {
					enabled: true,
					autoClear: {
						cookies: [
							{
								name: "id_format"
							},
							{
								name: "better-auth.last_used_login_method"
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

<ModeWatcher defaultMode="dark" />
<Toaster />

<div class="min-h-screen bg-gray-950">
	<Navbar />

	<main class="mt-20 grow px-4 pt-2" data-vaul-drawer-wrapper>
		{@render children()}
	</main>
</div>
