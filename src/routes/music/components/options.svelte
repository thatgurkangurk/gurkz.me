<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { SettingsIcon, XIcon } from "lucide-svelte";
	import FormatSelector from "./format-selector.svelte";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";

	let open = $state<boolean>(false);

	function onclick() {
		open = !open;
	}
</script>

<div class="py-2 flex gap-2 flex-col">
	<Button {onclick} size={"icon"} variant={"outline"}>
		{#if open}
			<XIcon />
		{:else}
			<SettingsIcon />
		{/if}
	</Button>

	{#if open}
		<Card>
			<CardHeader>
				<CardTitle>options</CardTitle>
			</CardHeader>
			<CardContent>
				<FormatSelector />
			</CardContent>
		</Card>
	{/if}
</div>
