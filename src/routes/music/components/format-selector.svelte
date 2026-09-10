<script lang="ts">
	import * as ToggleGroup from "#lib/components/ui/toggle-group/index.js";
	import { ID_FORMAT_OPTIONS, type IdFormat } from "#lib/features/music/format.js";
	import { usePreferences } from "#lib/preferences.svelte.js";

	const preferences = usePreferences();
</script>

<ToggleGroup.Root
	type="single"
	value={preferences.music.idFormat}
	spacing={2}
	onValueChange={(val) => {
		if (val) preferences.music.idFormat = val as IdFormat;
	}}
	class="inline-flex rounded-lg bg-muted p-1 text-muted-foreground select-none"
>
	{#each ID_FORMAT_OPTIONS as { value, label } (value)}
		<ToggleGroup.Item
			{value}
			aria-label={label}
			onclick={(e) => {
				if (preferences.music.idFormat === value) {
					e.preventDefault();
				}
			}}
			class="rounded-md px-3.5 py-1.5 text-sm font-medium transition-all data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
		>
			{label}
		</ToggleGroup.Item>
	{/each}
</ToggleGroup.Root>
