<script lang="ts">
	import FormatSelector from "./components/format-selector.svelte";
	import MusicCard from "./components/music-card.svelte";
	import { getMusicIds } from "./music.remote";
</script>

<p>music id list</p>

<FormatSelector />

<div
	class="grid w-full grid-cols-1 place-items-center gap-4 pt-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
>
	{#each await getMusicIds() as musicId (musicId.id)}
		<MusicCard {musicId} />
	{/each}
</div>
