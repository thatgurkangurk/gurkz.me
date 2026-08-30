<script lang="ts">
	import FormatSelector from "./components/format-selector.svelte";
	import MusicCard from "./components/music-card.svelte";
	import { scope } from "#lib/utils/scope.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { ConfirmDeleteDialog } from "#lib/components/ui/confirm-delete-dialog/index.js";
	import { useSession } from "#lib/session.svelte.js";
	import { getMusicIds } from "#lib/api/music.remote.js";
	import NewMusicIdForm from "./components/new-music-id-form.svelte";

	let searchFilter = $state("");

	let musicIds = $derived(await getMusicIds());

	const filteredMusicIds = $derived(
		musicIds.filter((id) => id.name.toLowerCase().includes(searchFilter.toLowerCase()))
	);

	const session = useSession();

	let id = $props.id();
</script>

<h1 class="text-3xl">music id list</h1>

{#if session.current?.user && session.current.user.permissions.includes("CREATE_MUSIC_IDS")}
	<NewMusicIdForm />
{/if}

<FormatSelector />

<ConfirmDeleteDialog />

<div class="grid max-w-60 grid-cols-1 gap-2 pt-4">
	<div>
		<Label for={scope(id, "search_filter")} class="pb-2">search</Label>
		<Input id={scope(id, "search_filter")} bind:value={searchFilter} />
	</div>
</div>

<div
	class="grid w-full grid-cols-1 place-items-center gap-4 pt-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
>
	{#each filteredMusicIds as musicId (musicId.id)}
		<MusicCard {musicId} />
	{/each}
</div>
