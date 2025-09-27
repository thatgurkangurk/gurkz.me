<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { IdFormatContext, type IdFormat } from "../context";

	const format = IdFormatContext.get();

	function setFormat(newFormat: IdFormat) {
		format.current = newFormat;
	}
</script>

<p>current format: {format.current}</p>
<div class="flex flex-row gap-2">
	<Button disabled={format.current === "DEFAULT"} onclick={() => setFormat("DEFAULT")}>
		default
	</Button>
	<Button disabled={format.current === "TRAITOR_TOWN"} onclick={() => setFormat("TRAITOR_TOWN")}>
		traitor town
	</Button>
</div>
