<script lang="ts">
	import { copy } from "$lib/attachments/copy.js";
	import type { Snippet } from "svelte";
	import { Button, type ButtonProps } from "./ui/button";

	type Props = {
		content: string;
		idle: Snippet;
		copied: Snippet;
	} & ButtonProps;

	let { content, idle, copied, ...rest }: Props = $props();
	let state = $state<"IDLE" | "COPIED">("IDLE");
	let isCopying = $derived(state === "COPIED");
</script>

<Button
	{...rest}
	disabled={isCopying}
	{@attach copy({
		content: content,
		onCopy: () => {
			state = "COPIED";
			setTimeout(() => {
				state = "IDLE";
			}, 500);
		}
	})}
>
	{#if isCopying}
		{@render copied()}
	{:else}
		{@render idle()}
	{/if}
</Button>
