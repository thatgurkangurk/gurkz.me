<script lang="ts">
	import { Moon, Sun } from "@lucide/svelte";
	import Button from "./ui/button/button.svelte";
	import { toggleMode } from "mode-watcher";
</script>

<Button
	onclick={toggleMode}
	variant="ghost"
	class="h-9 w-9 rounded-full bg-gray-100 text-black transition-colors hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/30"
	size="icon"
>
	<Sun
		class={[
			"h-[1.2rem] w-[1.2rem] transition-all!",
			"scale-100 rotate-0 dark:scale-0 dark:-rotate-90"
		]}
	/>
	<Moon
		class={[
			"h-[1.2rem] w-[1.2rem] transition-all!",
			"absolute scale-0 rotate-90 dark:scale-100 dark:rotate-0"
		]}
	/>
	<span class="sr-only">Toggle theme</span>
</Button>
