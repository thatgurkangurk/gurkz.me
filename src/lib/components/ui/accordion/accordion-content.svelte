<script lang="ts">
	import { type WithoutChild, cn } from "#lib/utils.js";

	import { Accordion as AccordionPrimitive } from "bits-ui";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithoutChild<AccordionPrimitive.ContentProps> = $props();
</script>

<AccordionPrimitive.Content
	bind:ref
	data-slot="accordion-content"
	class="text-sm data-open:animate-accordion-down data-closed:animate-accordion-up overflow-hidden"
	{...restProps}
>
	<div
		class={cn(
			"pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
			className
		)}
	>
		{@render children?.()}
	</div>
</AccordionPrimitive.Content>
