<script lang="ts">
	import CopyButton from "$lib/components/copy-button.svelte";
	import { getFormatState } from "./format-context";
	import { formattedId } from "./format.svelte";

	const format = getFormatState();

	let {
		id
	}: {
		id: string | number;
	} = $props();

	let formatted = $derived(formattedId(id, format.current));
</script>

<span class="pr-2">{formatted}</span>
<CopyButton content={formatted} />
