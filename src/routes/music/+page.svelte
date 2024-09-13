<script lang="ts">
	import type { PageServerData } from "./$types";
	import CopyButton from "$lib/components/copy-button.svelte";
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
	import CreateMusicForm from "$lib/components/forms/create-music-form.svelte";
	import type { MusicId } from "$lib/music";

	type Props = {
		data: PageServerData;
	};

	let { data }: Props = $props();
</script>

{#snippet musicCard({ name, robloxId, creator }: MusicId)}
	<Card class="w-full h-full">
		<CardHeader>
			<CardTitle class="text-xl">{name}</CardTitle>
		</CardHeader>
		<CardContent class="flex items-center text-xl">
			<span>
				{robloxId}
			</span>
			<CopyButton content={robloxId} />
		</CardContent>
		<CardFooter class="grid gap-1 grid-cols-1">
			<p>created by {creator.username}</p>
		</CardFooter>
	</Card>
{/snippet}

<h1 class="text-3xl">music id list</h1>

{#if data.canCreateMusicIds}
	<Card class="w-full max-w-xs">
		<CardHeader>
			<CardTitle>create a new music id</CardTitle>
		</CardHeader>
		<CardContent>
			<CreateMusicForm data={data.form} />
		</CardContent>
	</Card>
{/if}

<div
	class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4"
>
	{#each data.ids as id}
		{@render musicCard(id)}
	{/each}
</div>
