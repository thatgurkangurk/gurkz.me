<script lang="ts">
	import Meta from "$lib/components/meta.svelte";
	import { getSession, signIn, signOut } from "$lib/auth.remote.js";

	const session = $derived(await getSession());
</script>

<Meta title="home" />

<p>hi</p>

{#if session}
	<div class="flex items-center-safe gap-2">
		<p class="whitespace-nowrap">hello, {session.user.name}</p>
		<form {...signOut}>
			<button type="submit">log out</button>
		</form>
	</div>
{:else}
	<form {...signIn}>
		<input {...signIn.fields.provider.as("hidden", "discord")} />
		<button type="submit">log in</button>
	</form>
{/if}
