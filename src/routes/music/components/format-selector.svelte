<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { IdFormatContext, type IdFormat } from "../context";

	const format = IdFormatContext.get();
</script>

{#snippet selectorButton(newFormat: IdFormat, label: string)}
	<Button disabled={format.current === newFormat} onclick={() => (format.current = newFormat)}>
		{label}
	</Button>
{/snippet}

<p>current format: {format.current}</p>
<div class="flex flex-row gap-2 select-none">
	{@render selectorButton("DEFAULT", "default")}
	{@render selectorButton("TRAITOR_TOWN", "traitor town")}
</div>
