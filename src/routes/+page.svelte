<script lang="ts">
	import { authClient } from "$lib/auth-client";

	const session = authClient.useSession();
</script>

<h1 class="text-3xl">welcome</h1>

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
