<script lang="ts">
	import CopyButton from "$lib/components/copy-button.svelte";
	import FormatSelector from "./components/format-selector.svelte";
	import FormattedId, { formatId } from "./components/formatted-id.svelte";
	import { IdFormatContext } from "./context";
	import { getMusicIds } from "./music.remote";

	const format = IdFormatContext.get();
</script>

<p>music id list</p>

<FormatSelector />

{#each await getMusicIds() as musicId (musicId.id)}
	<div class="flex items-center gap-2">
		<p>{musicId.name} - <FormattedId robloxId={musicId.robloxId} /></p>
		<CopyButton variant={"outline"} text={formatId(musicId.robloxId, format.current)} />
	</div>
{/each}
