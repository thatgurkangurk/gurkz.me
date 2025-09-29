<script lang="ts">
	import { authClient } from "$lib/auth";

	const session = authClient.useSession();

	async function login() {
		await authClient.signIn.social({
			provider: "discord"
		});
	}

	async function logout() {
		await authClient.signOut();
	}
</script>

<p>hi</p>

{#if $session.isPending}
	<p>loading</p>
{:else if $session.data}
	{@const user = $session.data.user}
	<div>
		<p>hello, {user.name}</p>
		<button onclick={logout}>log out</button>
	</div>
{:else}
	<div>
		<button onclick={login}>log in</button>
	</div>
{/if}
