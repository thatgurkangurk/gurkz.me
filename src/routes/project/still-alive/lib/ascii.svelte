<script lang="ts">
	import { onMount } from "svelte";
	import { ascii, artPieces } from "../utils/ascii";

	onMount(() => {
		ascii.set("clear");
	});
</script>

<div class="container_asciiart">
	{#each artPieces as art}
		{#if $ascii === `asciiart_${art.id}`}
			<pre id={`asciiart_${art.id}`}>{art.content}</pre>
		{/if}
	{/each}
</div>
