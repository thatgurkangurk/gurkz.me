<script lang="ts">
	import FormatSelector from "./components/format-selector.svelte";
	import FormattedId from "./components/formatted-id.svelte";
	import { getMusicIds } from "./music.remote";
</script>

<p>music id list</p>

<FormatSelector />

{#each await getMusicIds() as musicId (musicId.id)}
	<p>{musicId.name} - <FormattedId robloxId={musicId.robloxId} /></p>
{/each}
