<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { SettingsIcon, XIcon } from "lucide-svelte";
	import FormatSelector from "./format-selector.svelte";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { getVerifiedOnlyState } from "./verified-context.svelte";
	import { Label } from "$lib/components/ui/label";

	let open = $state<boolean>(false);

	function onclick() {
		open = !open;
	}

	const ctx = getVerifiedOnlyState();
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
				<div class="pt-2 flex items-center space-x-2">
					<Checkbox id="terms" bind:checked={ctx.state} />
					<Label
						for="terms"
						class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Only show verified music ids?
					</Label>
				</div>
			</CardContent>
		</Card>
	{/if}
</div>
