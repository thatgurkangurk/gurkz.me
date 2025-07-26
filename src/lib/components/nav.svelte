<script lang="ts">
	import { authClient } from "$lib/auth-client";
	import Link from "./link.svelte";
	import ModeToggle from "./mode-toggle.svelte";

	const session = authClient.useSession();
</script>

<nav class="flex w-full items-center gap-2 p-2">
	<Link href="/">home</Link>
	<Link href="/music">music id list</Link>

	<div class="ml-auto flex gap-2">
		{#if $session.data}
			<div class="flex items-center-safe gap-2">
				<p>hello, {$session.data.user.name}</p>
				<button onclick={async () => await authClient.signOut()}>log out</button>
			</div>
		{:else}
			<button
				onclick={async () => {
					await authClient.signIn.social({
						provider: "discord"
					});
				}}
			>
				log in
			</button>
		{/if}
		<ModeToggle />
	</div>
</nav>

<style>
	nav {
		view-transition-name: "navbar";
	}
</style>
