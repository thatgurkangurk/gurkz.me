<script lang="ts">
	import type { InputConstraint } from "sveltekit-superforms";

	let {
		name,
		value = $bindable(),
		type = "text",
		label,
		errors,
		constraints,
		...rest
	}: {
		name: string;
		value: string;
		type?: string;
		label?: string;
		errors?: string[];
		constraints?: InputConstraint;
	} = $props();
</script>

<label>
	{#if label}<span>{label}</span><br />{/if}
	<input
		class="rounded-md p-2 outline outline-red-500"
		{name}
		{type}
		bind:value
		aria-invalid={errors ? "true" : undefined}
		{...constraints}
		{...rest}
	/>
</label>
{#if errors}<span class="invalid">{errors}</span>{/if}
