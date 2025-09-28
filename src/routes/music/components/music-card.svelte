<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from "$lib/components/ui/card/index.js";
	import type { MusicIdWithCreator } from "$lib/schemas/music";
	import FormattedId, { formatId } from "./formatted-id.svelte";
	import { IdFormatContext } from "../context";
	import CopyButton from "$lib/components/copy-button.svelte";
	const format = IdFormatContext.get();

	let { musicId }: { musicId: MusicIdWithCreator } = $props();
</script>

<Card class="h-full w-full">
	<CardHeader>
		<CardTitle class="text-xl">{musicId.name}</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="flex items-center gap-2 text-xl">
			<FormattedId robloxId={musicId.robloxId} />
			<CopyButton variant={"outline"} text={formatId(musicId.robloxId, format.current)} />
		</div>

		{#if musicId.tags && musicId.tags.length > 0}
			<div class="mt-2 flex flex-row gap-2">
				{#each musicId.tags as tag}
					<Badge variant="outline">
						{tag}
					</Badge>
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
