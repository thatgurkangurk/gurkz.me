<script lang="ts">
	import {
		InputGroup,
		InputGroupAddon,
		InputGroupButton,
		InputGroupInput
	} from "#lib/components/ui/input-group/index.js";
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
			<InputGroup class="h-8">
				<InputGroupAddon>
					<Search class="h-4 w-4" />
				</InputGroupAddon>

				<InputGroupInput {id} bind:value {placeholder} />

				<InputGroupAddon align="inline-end">
					<div class="flex w-4 items-center justify-center">
						{#if isSearching}
							<Loader class="h-4 w-4 animate-spin text-muted-foreground" />
						{:else if value}
							<InputGroupButton
								aria-label="clear search"
								title="clear search"
								size="icon-xs"
								onclick={() => (value = "")}
							>
								<X class="h-4 w-4 text-muted-foreground" />
							</InputGroupButton>
						{/if}
					</div>
				</InputGroupAddon>
			</InputGroup>
		</div>
	</div>
</div>
