<script lang="ts">
	import LightSwitch from "$lib/components/light-switch.svelte";
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	let { children } = $props();
</script>

<ModeWatcher />
<LightSwitch />

<div class="flex gap-2">
	<p class="font-bold">the makeshift navbar</p>
	<a href="/">home</a>
	<a href="/music">music id list</a>
</div>

{@render children?.()}
