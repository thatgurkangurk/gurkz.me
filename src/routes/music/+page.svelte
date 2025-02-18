<script lang="ts">
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

{#each data.musicIds as musicId}
	{#if musicId.verified}
		<p>{musicId.name} - <span>{musicId.robloxId}</span></p>
	{/if}
{/each}
