<script lang="ts">
	import { toggleMode } from "mode-watcher";
	import { Button } from "$lib/components/ui/button/index.js";
	import type { LightSwitchProps } from "./types";

	let { variant = "outline" }: LightSwitchProps = $props();
</script>

<Button onclick={toggleMode} {variant} size="icon">
	<span
		class="icon-[lucide--sun] h-4 w-4 scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
	></span>
	<span
		class="absolute icon-[lucide--moon] h-4 w-4 scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
	></span>
	<span class="sr-only">Toggle theme</span>
</Button>
