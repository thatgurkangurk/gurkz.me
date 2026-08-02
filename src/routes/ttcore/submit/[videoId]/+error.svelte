<script lang="ts">
	import { page } from "$app/state";
	import { Button } from "$lib/components/ui/button/index.js";
	import { useSession } from "$lib/session.svelte";
	import { dev } from "$app/environment";

	const session = useSession();
</script>

{#if page.status === 401}
	<h1 class="text-3xl font-bold tracking-tight md:text-4xl">please sign in to continue</h1>
	<br />
	<Button
		onclick={() =>
			session.authClient.signIn.social({
				provider: "discord",
				loginHint: "yes"
			})}>sign in with Discord</Button
	>
{:else if page.status === 403}
	<h1 class="text-3xl font-bold tracking-tight md:text-4xl">
		{page.error?.message ?? "sorry, but you cannot access this page"}
	</h1>
	<h1>error {page.status}: {page.error?.message}</h1>
{:else}
	<h1>unknown error {page.status}</h1>
	<p>{page.error?.message}</p>

	{#if dev}
		<pre>{JSON.stringify(page.error, null, 2)}</pre>
	{/if}
{/if}
