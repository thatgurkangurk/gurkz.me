<script lang="ts">
	import ThemeSwitcher from "$lib/components/theme-switcher.svelte";
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import type { Snippet } from "svelte";

	type Props = {
		children: Snippet<[]>;
	};

	let { children }: Props = $props();
</script>

<ModeWatcher defaultMode="system" />
{@render children()}

<ThemeSwitcher />
