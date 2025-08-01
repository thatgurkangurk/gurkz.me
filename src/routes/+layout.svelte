<script lang="ts">
	import Nav from "$lib/components/nav.svelte";
	import ViewTransitions from "$lib/components/view-transitions.svelte";
	import { ModeWatcher } from "mode-watcher";
	import "../app.css";

	let { children } = $props();
</script>

<ModeWatcher />
<ViewTransitions />
<Nav />
<main class="p-2">
	{@render children()}
</main>
