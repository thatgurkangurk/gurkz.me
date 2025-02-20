<script lang="ts">
	import { CardTitle } from "$lib/components/ui/card";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import { getFormatState } from "./format-context";

	const format = getFormatState();
</script>

<CardTitle class="pb-2 text-xl">format selector</CardTitle>

<Tabs.Root bind:value={format.current} class="max-w-[400px]">
	<Tabs.List class="grid w-full grid-cols-2">
		<Tabs.Trigger value="DEFAULT">default</Tabs.Trigger>
		<Tabs.Trigger value="TRAITOR_TOWN">traitor town</Tabs.Trigger>
	</Tabs.List>
</Tabs.Root>
