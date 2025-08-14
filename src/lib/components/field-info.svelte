<script lang="ts">
	import type { AnyFieldApi } from "@tanstack/svelte-form";

	let { field }: { field: AnyFieldApi } = $props();
</script>

{#if field.state.meta.isTouched}
	{#if !field.state.meta.isValid}
		<div class="text-destructive text-sm font-medium">
			{#each field.state.meta.errors as error}
				<div>{error.message}</div>
			{/each}
		</div>
	{/if}
{/if}
