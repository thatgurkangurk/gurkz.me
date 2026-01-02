<script lang="ts">
	import type { PageProps } from "./$types";
	import MusicCard from "./components/music-card.svelte";

	let { data }: PageProps = $props();
</script>

<h1 class="text-3xl">music id list</h1>

<div
	class="grid w-full grid-cols-1 place-items-center gap-4 pt-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
>
	{#each data.musicIds as musicId (musicId.id)}
		<MusicCard {musicId} />
	{/each}
</div>
