<script lang="ts">
	import { Check, Clipboard } from "lucide-svelte";
	import Button from "./ui/button/button.svelte";
	import { copyText } from "svelte-copy";

	type State = "copied" | "idle";

	type Props = {
		/**
		 * the content to copy when clicked
		 */
		content: string | number;
	};

	let { content }: Props = $props();
	let state = $state<State>("idle");
</script>

<Button
	onclick={() => {
		state = "copied";

		copyText(String(content)).catch((err) => {
			console.error(err);
			alert("could not copy :(");
		});

		setTimeout(() => {
			state = "idle";
		}, 2000);
	}}
	size="icon"
	variant="outline"
>
	{#if state === "copied"}
		<Check />
	{:else}
		<Clipboard />
	{/if}
</Button>
