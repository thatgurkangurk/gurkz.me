<script lang="ts">
	import CopyButton from "$lib/components/copy-button.svelte";
	import { Badge } from "$lib/components/ui/badge";
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { format } from "../format";
	import Clipboard from "virtual:icons/lucide/clipboard";
	import Check from "virtual:icons/lucide/check";
	import type { MusicIdWithCreator } from "$lib/schemas/music";

	type Props = {
		musicId: MusicIdWithCreator;
	};

	let { musicId }: Props = $props();
	let formattedId = $derived(format(musicId.robloxId));
</script>

<Card class="h-full w-full">
	<CardHeader>
		<CardTitle class="text-xl">{musicId.name}</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="flex items-center text-xl">
			<span class="pr-2">{formattedId}</span>
			<CopyButton size={"icon"} content={formattedId}>
				{#snippet idle()}
					<Clipboard />
				{/snippet}
				{#snippet copied()}
					<Check />
				{/snippet}
			</CopyButton>
		</div>
		{#if musicId.tags}
			<div class="grid grid-cols-2 gap-2">
				{#each musicId.tags as tag}
					<Badge variant={"outline"}>{tag}</Badge>
				{/each}
			</div>
		{/if}
	</CardContent>
	<CardFooter class="grid grid-cols-1 gap-1">
		<p>
			created by <span>{musicId.creator.name}</span>
		</p>
	</CardFooter>
</Card>
