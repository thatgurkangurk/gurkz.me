<script lang="ts">
	import { enhance } from "$app/forms";
	import type { PageData } from "./$types";
	import { getUser } from "$lib/auth/store";

	let user = getUser();
</script>

<svelte:head>
	<title>home - gurkan's website</title>
</svelte:head>

<h2 class="text-3xl">hello!</h2>

<p>welcome to my website! feel free to look around :)</p>
{#if $user}
	<p>hi, {$user.username} - {$user.email}</p>

	<form use:enhance method="post" action="/auth/logout">
		<button>log out</button>
	</form>
{/if}
