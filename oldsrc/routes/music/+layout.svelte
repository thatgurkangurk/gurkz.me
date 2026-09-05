<script lang="ts">
	import { IdFormatState, setIdFormat } from "./context.svelte.js";

	let { children, data } = $props();

	// svelte-ignore state_referenced_locally
	const formatState = new IdFormatState($state.snapshot(data.idFormat));

	setIdFormat(formatState);
</script>

{@render children()}
