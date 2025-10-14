<script lang="ts">
	import { authClient } from "$lib/auth";
	import Meta from "$lib/components/meta.svelte";
	import { useSession, useSignIn, useSignOut } from "$lib/session";

	const session = useSession();
	const { mutateAsync: signOutAsync } = useSignOut();
	const { mutateAsync: signInAsync } = useSignIn();
</script>

<Meta title="home" />

<p>hi</p>

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
