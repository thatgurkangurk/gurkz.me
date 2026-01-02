<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { getIdFormat, type IdFormat } from "../context.svelte.js";

	const state = getIdFormat();
</script>

{#snippet selectorButton(newFormat: IdFormat, label: string)}
	<Button
		disabled={state.idFormat.current === newFormat}
		onclick={() => (state.idFormat.current = newFormat)}
	>
		{label}
	</Button>
{/snippet}

<p>current format: {state.idFormat.current}</p>
<div class="flex flex-row gap-2 select-none">
	{@render selectorButton("DEFAULT", "default")}
	{@render selectorButton("TRAITOR_TOWN", "traitor town")}
</div>
