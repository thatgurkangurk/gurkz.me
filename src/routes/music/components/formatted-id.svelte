<script lang="ts">
	import { CopyButton } from "$lib/components/ui/copy-button/index.js";
	import { getIdFormat } from "../context.svelte.js";
	let { robloxId }: { robloxId: string } = $props();

	const state = getIdFormat();

	const formattedId = $derived.by(() => state.format(robloxId));
</script>

<span>{formattedId}</span>
<CopyButton text={formattedId} variant={"outline"} />
