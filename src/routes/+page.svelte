<script lang="ts">
	import { enhance } from "$app/forms";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

<svelte:head>
    <title>home - gurkan's website</title>
</svelte:head>

<h1 class="text-4xl">hello world</h1>
{#if data.subject}
	<p>hello, {data.subject.username}</p>
	<form use:enhance method="POST" action="/auth?/logout">
		<button type="submit">log out</button>
	</form>
{:else}
	<form use:enhance method="POST" action="/auth?/login">
		<button type="submit">log in</button>
	</form>
{/if}
