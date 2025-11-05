<script lang="ts">
	import { getUsers } from "$lib/api/admin.remote.js";
	import { getSession } from "$lib/auth.remote.js";
	import type { PageProps } from "./$types";
	import UserCard from "./components/user-card.svelte";

	let { data }: PageProps = $props();

	let users = $derived(await getUsers());
	let session = $derived(await getSession());
</script>

<h1 class="text-3xl">welcome to admin, {session?.user.name}!</h1>

<div
	class="grid w-full grid-cols-1 place-items-center gap-4 pt-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
>
	{#each users.users as user (user.id)}
		<UserCard {user} />
	{/each}
</div>
