<script lang="ts">
	import FormatSelector from "./components/format-selector.svelte";
	import MusicCard from "./components/music-card.svelte";
	import { hasPermission } from "$lib/permissions";
	import CreateMusicIdForm from "./components/create-music-id-form.svelte";
	import Meta from "$lib/components/meta.svelte";
	import { listMusicIds } from "$lib/music/music.remote";
	import { getSession } from "$lib/auth.remote";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";

	const session = $derived(await getSession());
	const musicIds = $derived(await listMusicIds());
	let searchFilter = $state("");

	const filteredMusicIds = $derived(
		musicIds.filter((id) => id.name.toLowerCase().includes(searchFilter.toLowerCase()))
	);
</script>

<Meta title="music id list" />

<p>music id list</p>

{#if session?.user && hasPermission(session.user, "CREATE_MUSIC_IDS")}
	<CreateMusicIdForm />
{/if}

<FormatSelector />

<div class="grid max-w-60 grid-cols-1 gap-2 pt-4">
	<div>
		<Label class="pb-2">search</Label>
		<Input bind:value={searchFilter} />
	</div>
</div>

<div
	class="grid w-full grid-cols-1 place-items-center gap-4 pt-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
>
	{#each filteredMusicIds as musicId (musicId.id)}
		<MusicCard {session} {musicId} />
	{/each}
</div>
