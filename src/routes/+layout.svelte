<script lang="ts">
	import Nav from "$lib/components/nav.svelte";
	import ViewTransitions from "$lib/components/view-transitions.svelte";
	import "../app.css";

	let { children } = $props();
</script>

<ViewTransitions />
<Nav />
{@render children()}
