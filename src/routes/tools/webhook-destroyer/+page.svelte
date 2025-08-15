<script lang="ts">
	import FieldInfo from "$lib/components/field-info.svelte";
	import Meta from "$lib/components/meta.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { WebhookDestroyerState } from "./state.svelte";
	import { Card, CardContent } from "$lib/components/ui/card/index.js";
	import Tool from "$lib/components/tool.svelte";

	let id = $props.id();

	const state = new WebhookDestroyerState(id);

	let { form } = $derived(state);
</script>

<Tool tool="webhook-destroyer">
	{#snippet children(tool)}
		<h1 class="text-3xl">{tool.title}</h1>

		<h2 class="text-xl">{tool.description}</h2>

		<Card class="w-full max-w-xs">
			<CardContent>
				<form
					onsubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<form.Field name="url">
						{#snippet children(field)}
							<div class="space-y-2">
								<Label for="{form.formId}-name">webhook url</Label>
								<Input
									id="{form.formId}-name"
									aria-invalid={!field.state.meta.isValid}
									name={field.name}
									value={field.state.value}
									onblur={field.handleBlur}
									oninput={(e) => field.handleChange(e.currentTarget.value)}
								/>
								<FieldInfo {field} />
							</div>
						{/snippet}
					</form.Field>

					<form.Subscribe
						selector={(state) => ({
							canSubmit: state.canSubmit,
							isSubmitting: state.isSubmitting
						})}
					>
						{#snippet children({ canSubmit, isSubmitting })}
							<br />
							<Button variant="destructive" type="submit" disabled={!canSubmit}>
								{isSubmitting ? "submitting" : "submit"}
							</Button>
						{/snippet}
					</form.Subscribe>
				</form>
			</CardContent>
		</Card>
	{/snippet}
</Tool>
