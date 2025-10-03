<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		class?: string;
		id?: string;
		expanded: boolean;
		children: Snippet;
	}

	let { class: className, id, expanded, children }: Props = $props();

	// Element reference
	let element: HTMLDivElement;

	// Updates the expandable element height
	function updateElementHeight() {
		element.style.height = `${expanded ? element.scrollHeight : 0}px`;
	}

	// Update height when expanded prop changes
	$effect(() => {
		expanded;
		setTimeout(updateElementHeight);
	});
</script>

<svelte:window
	onresize={() => {
		element.style.maxHeight = "0";
		updateElementHeight();
		element.style.maxHeight = "";
	}}
/>

<div
	bind:this={element}
	class={[
		"!m-0 h-0 origin-top duration-200",
		!expanded && "invisible -translate-y-2 scale-y-75 opacity-0",
		className
	]}
	{id}
	aria-hidden={!expanded}
>
	{@render children()}
</div>
