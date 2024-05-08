<script lang="ts">
	import PocketBase from "pocketbase";
	import type { PageData } from "./$types";
	import AuthProvider from "./auth-provider.svelte";

	export let data: PageData;

	$: ({ providers } = data);
</script>

<h3 class="text-3xl">welcome!</h3>
{#if providers.authProviders}
	<p>choose how you want to log in:</p>
	{#each providers.authProviders as provider}
		<AuthProvider {provider} />
	{/each}
{:else}
	<span>no auth providers were configured</span>
{/if}
