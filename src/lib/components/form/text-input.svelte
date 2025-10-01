<script lang="ts">
	import type { FieldElementProps } from "@formisch/svelte";
	import InputErrors from "./input-errors.svelte";
	import { Label } from "../ui/label";
	import { Input } from "../ui/input";
	import type { Snippet } from "svelte";

	type Props = {
		class?: string;
		type: "text" | "email" | "tel" | "password" | "url" | "number" | "date";
		label?: string;
		placeholder?: string;
		required?: boolean;
		input: string | number | undefined;
		errors: [string, ...string[]] | null;
		button?: Snippet;
	} & FieldElementProps;

	let {
		class: className,
		label,
		name,
		required,
		input,
		errors,
		button,
		...fieldProps
	}: Props = $props();

	let value: string | number | undefined = $state();

	$effect(() => {
		value = type === 'number' && typeof input === 'string'
			? Number(input)
			: input;
	});
</script>

<div class={[className]}>
	<Label class={[!!errors && "text-destructive", "pb-2"]} for={name}>{label}</Label>
	{#if button}
		<div class="flex w-full max-w-sm items-center gap-2">
			<Input
				{...fieldProps}
				id={name}
				{name}
				{value}
				{required}
				aria-invalid={!!errors}
				aria-errormessage={`${name}-error`}
			/>
			{@render button()}
		</div>
	{:else}
		<Input
			{...fieldProps}
			id={name}
			{name}
			{value}
			{required}
			aria-invalid={!!errors}
			aria-errormessage={`${name}-error`}
		/>
	{/if}

	<InputErrors {name} {errors} />
</div>
