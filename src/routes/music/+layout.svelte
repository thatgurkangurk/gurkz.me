<script lang="ts">
	import { CookieState } from "$lib/cookie-state.svelte";
	import { setIdFormat } from "./context.js";

	let { children, data } = $props();

	const state = new CookieState("id_format", data.idFormat);

	setIdFormat(state);
</script>

{@render children()}
