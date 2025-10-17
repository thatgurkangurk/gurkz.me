<script lang="ts">
	import Expandable from "./expandable.svelte";

	type Props = {
		name: string;
		errors: string[] | null;
	};

	let { name, errors }: Props = $props();

	// Keep a frozen copy of errors
	let frozenErrors: string[] | null = $state(null);

	// Freeze errors while collapsing to prevent UI jumping
	$effect(() => {
		if (errors && errors.length > 0) {
			frozenErrors = errors;
		} else {
			const timeout = setTimeout(() => {
				frozenErrors = null;
			}, 200);

			return () => clearTimeout(timeout);
		}
	});
</script>

<Expandable expanded={!!(errors && errors.length)}>
	<div id={`${name}-error`} class="text-sm font-medium text-destructive">
		{frozenErrors?.[0]}
	</div>
</Expandable>
