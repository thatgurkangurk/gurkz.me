<script lang="ts">
	import { Input } from "#lib/components/ui/input/index.js";
	import { Label } from "#lib/components/ui/label/index.js";

	import { Loader, Search, X } from "@lucide/svelte";

	let {
		id,
		label = "search",
		placeholder = "search...",
		value = $bindable(""),
		isSearching = false
	}: {
		id: string;
		label?: string;
		placeholder?: string;
		value?: string;
		isSearching?: boolean;
	} = $props();
</script>

<div class="grid max-w-md grid-cols-1 gap-2 pt-2">
	<div class="space-y-2.5">
		<Label for={id} class="text-sm font-medium tracking-wide">
			{label}
		</Label>
		<div class="relative flex items-center">
			<Search
				class="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/70 transition-colors duration-200"
			/>

			<Input
				{id}
				bind:value
				{placeholder}
				class="h-10 pr-10 pl-10 shadow-xs transition-shadow duration-200 focus-visible:ring-2"
			/>

			<div class="absolute top-1/2 right-3.5 flex -translate-y-1/2 items-center">
				{#if isSearching}
					<Loader class="h-4 w-4 animate-spin text-muted-foreground" />
				{:else if value}
					<button
						type="button"
						onclick={() => (value = "")}
						class="rounded-sm opacity-70 ring-offset-background transition-all duration-200 hover:scale-110 hover:opacity-100 focus:ring-2 focus:ring-ring focus:outline-none"
					>
						<X class="h-4 w-4 text-muted-foreground" />
						<span class="sr-only">clear search</span>
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>
