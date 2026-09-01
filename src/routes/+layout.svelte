<script lang="ts">
	import "./layout.css";
	import { configure } from "onedollarstats";
	import favicon from "#lib/assets/favicon.svg";
	import { ModeWatcher } from "mode-watcher";
	import Navbar from "#lib/components/navbar.svelte";
	import { SessionState, setSession } from "#lib/session.svelte.js";
	import type { LayoutProps } from "./$types";

	import "vanilla-cookieconsent/dist/cookieconsent.css";
	import { run } from "#lib/cookie-consent.js";
	import { Toaster } from "svelte-sonner";
	import { page } from "$app/state";
	import { PermixProvider, PermixHydrate } from "permix/svelte";
	import { getRules, permix } from "#lib/permix.js";

	const { children, data }: LayoutProps = $props();

	// svelte-ignore state_referenced_locally
	let sessionState = new SessionState($state.snapshot(data.session));

	setSession(sessionState);

	$effect(() => {
		const permixRules = getRules(sessionState.current?.user);

		console.log("updating permix rules");

		permix.setup(permixRules);
	});

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

<svelte:head>
	{#if page.data.meta}
		<title>{page.data.meta.title}</title>
		<link rel="icon" href={favicon} />

		<meta property="og:title" content={page.data.meta.title} />
		<meta property="og:description" content={page.data.meta.description} />
		<meta property="og:type" content="website" />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<PermixProvider {permix}>
	<PermixHydrate state={data.permixState}>
		<ModeWatcher defaultMode="dark" />
		<Toaster />

		<div class="min-h-screen bg-gray-950">
			<Navbar />

			<main class="mt-20 grow px-4 pt-2" data-vaul-drawer-wrapper>
				{@render children()}
			</main>
		</div>
	</PermixHydrate>
</PermixProvider>
