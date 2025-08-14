<script lang="ts">
	import Link from "./link.svelte";
	import ModeToggle from "./mode-toggle.svelte";
	import { useSession, useSignIn, useSignOut } from "$lib/hooks/session";

	const session = useSession();
	const { mutateAsync: signOutAsync } = useSignOut();
	const { mutateAsync: signInAsync } = useSignIn();
</script>

<nav class="flex w-full items-center gap-2 p-2">
	<Link href="/">home</Link>
	<Link href="/music">music id list</Link>
	<Link href="/tools">tools</Link>

	<div class="ml-auto flex gap-2">
		{#if session.data}
			<div class="flex items-center-safe gap-2">
				<p>hello, {session.data.user.name}</p>
				<button
					onclick={async () => {
						await signOutAsync(null);
					}}>log out</button
				>
			</div>
		{:else}
			<button
				onclick={async () => {
					await signInAsync({
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
