<script lang="ts">
	import { CookieState } from "$lib/cookie-state.svelte";
	import { IdFormatContext } from "./context";

	let { children, data } = $props();

	const state = new CookieState("id_format", data.idFormat);

	IdFormatContext.set(state);
</script>

{@render children()}
