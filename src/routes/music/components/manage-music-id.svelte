<script lang="ts">
	import type { MusicIdWithCreator } from "$lib/schemas/music";
	import DeleteMusicId from "./delete-music-id.svelte";
	import EditMusicId from "./edit-music-id.svelte";

	type Props = {
		musicId: MusicIdWithCreator;
	};

	let { musicId }: Props = $props();
</script>

<div class="flex flex-row gap-2">
	<EditMusicId {musicId} />
	<DeleteMusicId {musicId} />
</div>
