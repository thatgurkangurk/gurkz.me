<script lang="ts">
	import CopyButton from "$lib/components/copy-button.svelte";
	import { Badge } from "$lib/components/ui/badge";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { format } from "../format";
	import type { MusicId } from "../types";

	type Props = {
		musicId: MusicId;
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
			<CopyButton content={formattedId}>
				{#snippet idle()}
					copy
				{/snippet}
				{#snippet copied()}
					copied
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
</Card>
