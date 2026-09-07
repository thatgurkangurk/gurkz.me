<script lang="ts">
	import favicon from "#lib/assets/favicon.svg";
	import Navbar from "#lib/components/navbar.svelte";
	import { run } from "#lib/cookie-consent.js";
	import { createPermix, getRules } from "#lib/permix.js";
	import { setPermix } from "#lib/permix.svelte.js";
	import { SessionState, setSession } from "#lib/session.svelte.js";

	import { page } from "$app/state";
	import { QueryClientProvider } from "@tanstack/svelte-query";
	import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
	import { ModeWatcher } from "mode-watcher";
	import { configure } from "onedollarstats";
	import { PermixHydrate, PermixProvider } from "permix/svelte";
	import { MetaTags, deepMerge } from "svelte-meta-tags";
	import { Toaster } from "svelte-sonner";
	import "vanilla-cookieconsent/dist/cookieconsent.css";

	import type { LayoutProps } from "./$types";
	import "./layout.css";

	const { children, data }: LayoutProps = $props();

	// svelte-ignore state_referenced_locally
	let sessionState = new SessionState($state.snapshot(data.session));

	setSession(sessionState);

	// svelte-ignore state_referenced_locally
	const permixInstance = createPermix(data.session?.user);

	setPermix(permixInstance);

	$effect.pre(() => {
		const user = sessionState.current?.user;

		permixInstance.setup(getRules(user));
	});

	$effect(() => {
		sessionState.authClient.hydrateSession(data.session);

		run({
			language: { default: "en", translations: { en: "/en.json" } },
			autoClearCookies: true,
			categories: {
				preferences: {
					enabled: true,
					autoClear: {
						cookies: [{ name: "id_format" }, { name: "better-auth.last_used_login_method" }]
					}
				}
			}
		});
	});

	$effect(() => {
		configure();
	});

	let metaTags = $derived(deepMerge(data.baseMetaTags, page.data.pageMetaTags));
</script>

<MetaTags {...metaTags} />

<QueryClientProvider client={data.queryClient}>
	<PermixProvider permix={permixInstance}>
		<PermixHydrate state={data.permixState}>
			<ModeWatcher defaultMode="dark" />
			<Toaster />

			<div class="min-h-screen bg-gray-950">
				<Navbar />

				<main class="mt-20 grow px-4 pt-2" data-vaul-drawer-wrapper>{@render children()}</main>
			</div>

			<SvelteQueryDevtools />
		</PermixHydrate>
	</PermixProvider>
</QueryClientProvider>
