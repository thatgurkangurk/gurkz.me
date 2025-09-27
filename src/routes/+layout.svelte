<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import Header from "$lib/components/header.svelte";
	import "../app.css";
	import type { LayoutProps } from "./$types";

	let { children }: LayoutProps = $props();
</script>

<ModeWatcher />
<Header />
<main class="p-2">{@render children()}</main>
