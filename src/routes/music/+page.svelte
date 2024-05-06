<script lang="ts">
	import type { PageData } from "./$types";
	import AddMusicIDForm from "./add-music-id-form.svelte";
	import * as Card from "$lib/components/ui/card";
	import AudioCard from "./audio-card.svelte";

	export let data: PageData;
</script>

<h2 class="text-3xl">roblox music ID list</h2>
<p>hello! welcome to our roblox music ID list!</p>

{#if data.userIsAdmin}
	<Card.Root class="w-fit">
		<Card.Header>
			<Card.Title class="text-xl">Add a new ID</Card.Title>
		</Card.Header>
		<Card.Content>
			<AddMusicIDForm data={data.form} />
		</Card.Content>
	</Card.Root>
{/if}

<div
	class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4"
>
	{#each data.ids as id}
		<AudioCard {id} user={data.user} userIsAdmin={data.userIsAdmin} />
	{/each}
</div>
