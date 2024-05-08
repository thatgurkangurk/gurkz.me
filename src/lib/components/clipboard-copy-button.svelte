<script lang="ts">
	import { Button } from "./ui/button";
	import { Check, Clipboard } from "lucide-svelte";
	import * as Tooltip from "$lib/components/ui/tooltip";

	export let contentToCopy: string | number;

	let state: "idle" | "copied" = "idle";
</script>

<Tooltip.Root openDelay={0}>
	<Tooltip.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			on:click={() => {
				state = "copied";
				navigator.clipboard.writeText(contentToCopy.toString());
				setTimeout(() => {
					state = "idle";
				}, 1000);
			}}
			variant="ghost"
		>
			{#if state === "idle"}
				<Clipboard class="h-6 w-6" />
			{:else if state === "copied"}
				<Check class="h-6 w-6" />
			{/if}
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content>
		{#if state === "idle"}
			<p>Copy to clipboard</p>
		{:else if state === "copied"}
			<p>Copied!</p>
		{/if}
	</Tooltip.Content>
</Tooltip.Root>
