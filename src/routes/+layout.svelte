<script lang="ts">
	import "./layout.css";
	import { configure } from "onedollarstats";
	import favicon from "$lib/assets/favicon.svg";
	import { authClient } from "$lib/auth";
	import { ModeWatcher } from "mode-watcher";
	import Navbar from "$lib/components/navbar.svelte";

	const { children } = $props();

	$effect(() => {
		configure();
	});

	const session = authClient.useSession();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ModeWatcher />

<Navbar
	links={[
		{
			label: "home",
			to: "/"
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
	<div>
		{#if $session.data}
			<div>
				<p>
					{$session.data.user.name}
				</p>
				<button
					onclick={async () => {
						await authClient.signOut();
					}}
				>
					Sign Out
				</button>
			</div>
		{:else}
			<button
				onclick={async () => {
					await authClient.signIn.social({
						provider: "discord"
					});
				}}
			>
				Continue with Discord
			</button>
		{/if}
	</div>
	{@render children()}
</main>
