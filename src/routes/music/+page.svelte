<script lang="ts">
	import type { PageServerData } from "./$types";
	import CopyButton from "$lib/components/copy-button.svelte";
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
	import CreateMusicForm from "$lib/components/forms/create-music-form.svelte";
	import type { MusicId } from "$lib/music";
	import { setIdFormatState } from "$lib/music/id-format.svelte";
	import IdFormatSelector from "$lib/music/id-format-selector.svelte";

	type Props = {
		data: PageServerData;
	};

	const idFormat = setIdFormatState();

	let { data }: Props = $props();
</script>

{#snippet musicCard({ name, robloxId, creator }: MusicId)}
	<Card class="w-full h-full">
		<CardHeader>
			<CardTitle class="text-xl">{name}</CardTitle>
		</CardHeader>
		<CardContent class="flex items-center text-xl">
			<span>
				{idFormat.formatId(robloxId)}
			</span>
			<CopyButton content={idFormat.formatId(robloxId)} />
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

<IdFormatSelector />

<div
	class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4"
>
	{#each data.ids as id}
		{@render musicCard(id)}
	{/each}
</div>
