<script lang="ts">
	import type { PageProps } from "./$types";
	import FormatSelector from "./components/format-selector.svelte";
	import MusicCard from "./components/music-card.svelte";
	import { scope } from "simple:scope";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { ConfirmDeleteDialog } from "$lib/components/ui/confirm-delete-dialog";

	let { data }: PageProps = $props();

	let searchFilter = $state("");

	const filteredMusicIds = $derived(
		data.musicIds.filter((id) => id.name.toLowerCase().includes(searchFilter.toLowerCase()))
	);
</script>

<h1 class="text-3xl">music id list</h1>

<FormatSelector />

<ConfirmDeleteDialog />

<div class="grid max-w-60 grid-cols-1 gap-2 pt-4">
	<div>
		<Label for={scope("search_filter")} class="pb-2">search</Label>
		<Input id={scope("search_filter")} bind:value={searchFilter} />
	</div>
</div>

<div
	class="grid w-full grid-cols-1 place-items-center gap-4 pt-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
>
	{#each filteredMusicIds as musicId (musicId.id)}
		<MusicCard {musicId} />
	{/each}
</div>
