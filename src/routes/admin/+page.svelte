<script lang="ts">
	import { getUsers } from "$lib/api/admin.remote.js";
	import { getSession } from "$lib/auth.remote.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import type { PageProps } from "./$types.js";
	import UserCard from "./components/user-card.svelte";

	let { data }: PageProps = $props();

	let users = $derived(await getUsers());
	let session = $derived(await getSession());
	let searchFilter = $state("");

	const filteredUsers = $derived(
		users.users.filter((id) => id.name.toLowerCase().includes(searchFilter.toLowerCase()))
	);
</script>

<h1 class="text-3xl">welcome to admin, {session?.user.name}!</h1>

<div class="grid max-w-60 grid-cols-1 gap-2 pt-4">
	<div>
		<Label class="pb-2">search</Label>
		<Input bind:value={searchFilter} />
	</div>
</div>

<div
	class="grid w-full grid-cols-1 place-items-center gap-4 pt-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
>
	{#each filteredUsers as user (user.id)}
		<UserCard {user} />
	{/each}
</div>
