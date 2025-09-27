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
		<div class="flex items-center text-xl">
			<FormattedId robloxId={musicId.robloxId} />
			<CopyButton variant={"outline"} text={formatId(musicId.robloxId, format.current)} />
		</div>

		{#if musicId.tags && musicId.tags.length > 0}
			{#each musicId.tags as tag}
				<div class="mt-2 grid grid-cols-2 gap-2">
					<Badge variant="outline">
						{tag}
					</Badge>
				</div>
			{/each}
		{/if}
	</CardContent>
	<CardFooter class="grid grid-cols-1 gap-1">
		<p>
			created by <span>{musicId.creator.name}</span>
		</p>
	</CardFooter>
</Card>
