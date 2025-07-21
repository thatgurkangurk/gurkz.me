<script lang="ts">
	import { authClient } from "$lib/auth-client";
	import Link from "./link.svelte";

	const session = authClient.useSession();
</script>

<nav class="flex w-full items-center gap-2 px-2">
	<Link href="/">home</Link>
	<Link href="/music">music id list</Link>

	<div class="ml-auto">
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
	</div>
</nav>

<style>
	nav {
		view-transition-name: "navbar";
	}
</style>
