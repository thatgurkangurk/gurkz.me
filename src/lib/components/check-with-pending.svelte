<script lang="ts">
	import { Check, usePermix } from "#lib/permix.svelte.js";

	import { type Snippet } from "svelte";
	import type { ComponentProps } from "svelte";

	type Props = ComponentProps<typeof Check> & {
		pending?: Snippet;
	};

	let { pending, ...restProps }: Props = $props();

	const permix = usePermix();
</script>

{#if !permix.isReady}
	{#if pending}
		{@render pending()}
	{/if}
{:else}
	<Check {...restProps} />
{/if}
