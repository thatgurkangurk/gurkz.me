<script lang="ts">
	import { createQuery } from "@tanstack/svelte-query";
	import FormatSelector from "./components/format-selector.svelte";
	import MusicCard from "./components/music-card.svelte";
	import { orpc } from "$lib/orpc";

	const query = createQuery(() => orpc.music.get.queryOptions());
</script>

<p>music id list</p>

<FormatSelector />

{#if query.data}
	<div
		class="grid w-full grid-cols-1 place-items-center gap-4 pt-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
	>
		{#each query.data as musicId (musicId.id)}
			<MusicCard {musicId} />
		{/each}
	</div>
{/if}
