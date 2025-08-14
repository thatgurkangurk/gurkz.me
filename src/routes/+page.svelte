<script lang="ts">
	import { useSession, useSignIn, useSignOut } from "$lib/hooks/session";

	const session = useSession();
	const { mutateAsync: signOutAsync } = useSignOut();
	const { mutateAsync: signInAsync } = useSignIn();
</script>

<h1 class="text-3xl">welcome</h1>

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
