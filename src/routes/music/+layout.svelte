<script lang="ts">
	import { CookieState } from "$lib/cookie-state.svelte";
	import { setIdFormat } from "./context.js";

	let { children, data } = $props();

	// svelte-ignore state_referenced_locally
	const cookieState = new CookieState("id_format", $state.snapshot(data.idFormat));

	setIdFormat(cookieState);
</script>

{@render children()}
