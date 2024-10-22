<script lang="ts">
	import { Alert, AlertTitle, AlertDescription } from "$lib/components/ui/alert";
	import { OctagonAlert } from "lucide-svelte";
	import { getIdFormatState } from "./id-format.svelte";
	import { ToggleGroup, ToggleGroupItem } from "$lib/components/ui/toggle-group";

	const idFormat = getIdFormatState();
</script>

<div class="text-center pt-3 gap-2">
	<ToggleGroup
		value={idFormat.idFormat}
		onValueChange={(value) => {
			if (!value) {
				idFormat.set("NORMAL");
				return;
			}

			idFormat.set(typeof value === "string" ? value : value[0]);
		}}
	>
		<ToggleGroupItem value="NORMAL" aria-label="normal">Normal</ToggleGroupItem>
		<ToggleGroupItem value="TRAITOR_TOWN" aria-label="traitor town">Traitor Town</ToggleGroupItem>
	</ToggleGroup>

	{#if idFormat.idFormat === "TRAITOR_TOWN"}
		<div class="text-left w-fit pt-2">
			<Alert variant={"destructive"}>
				<OctagonAlert class="h-4 w-4" />
				<AlertTitle>warning</AlertTitle>
				<AlertDescription>make sure that you own the sound player gamepass</AlertDescription>
			</Alert>
		</div>
	{/if}
</div>
