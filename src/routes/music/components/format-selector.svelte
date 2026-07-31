<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { getIdFormat, ID_FORMAT_OPTIONS } from "../context.svelte.js";

	const state = getIdFormat();
</script>

<div class="flex flex-row gap-2 select-none">
	{#each ID_FORMAT_OPTIONS as { value, label }}
		<Button
			disabled={state.idFormat.current === value}
			onclick={() => (state.idFormat.current = value)}
		>
			{label}
		</Button>
	{/each}
</div>
