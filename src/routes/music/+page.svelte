<script lang="ts">
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

{#each data.musicIds as musicId}
	<p>{musicId.name}</p>
{/each}
