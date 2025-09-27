<script lang="ts">
	import { getMusicIds } from "./music.remote";
</script>

<p>music id list</p>

{#each await getMusicIds() as musicId (musicId.id)}
	<p>{musicId.name} - {musicId.robloxId}</p>
{/each}
