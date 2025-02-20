<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import * as Card from "$lib/components/ui/card/index.js";
	import type { MusicId } from "../types";
	import FormattedId from "./formatted-id.svelte";

	let {
		id
	}: {
		id: MusicId;
	} = $props();
</script>

<Card.Root class="w-full h-full">
	<Card.Header>
		<Card.Title class="text-xl">{id.name}</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="flex items-center text-xl">
			<FormattedId id={id.robloxId} />
		</div>
		{#if id.tags}
			<div class="grid grid-cols-2 gap-2">
				{#each id.tags as tag}
					<Badge variant={"outline"}>{tag}</Badge>
				{/each}
			</div>
		{/if}
	</Card.Content>
	<Card.Footer class="grid gap-1 grid-cols-1">
		<p>created by {id.creator.name}</p>
	</Card.Footer>
</Card.Root>
