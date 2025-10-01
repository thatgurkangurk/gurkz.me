<script lang="ts">
	import { createQuery } from "@tanstack/svelte-query";
	import FormatSelector from "./components/format-selector.svelte";
	import MusicCard from "./components/music-card.svelte";
	import { orpc } from "$lib/orpc";
	import { useSession } from "$lib/session";
	import { hasPermission } from "$lib/permissions";
	import CreateMusicIdForm from "./components/create-music-id-form.svelte";

	const query = createQuery(() => orpc.music.get.queryOptions());
	const session = useSession();
</script>

<p>music id list</p>

{#if session.data?.user && hasPermission(session.data.user, "CREATE_MUSIC_IDS")}
	<CreateMusicIdForm />
{/if}

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
