<script lang="ts">
	import { superForm, defaults, setError } from "sveltekit-superforms";
	import { zod } from "sveltekit-superforms/adapters";
	import { webhookDestroyerSchema } from "./schema";
	import * as Form from "$lib/components/ui/form";
	import Input from "$lib/components/ui/input/input.svelte";
	import { toast } from "svelte-sonner";
	import { LoaderCircle } from "lucide-svelte";

	const form = superForm(defaults(zod(webhookDestroyerSchema)), {
		SPA: true,
		validators: zod(webhookDestroyerSchema),
		async onUpdate({ form }) {
			if (!form.valid) return;
			try {
				const res = await fetch(form.data.url, {
					method: "DELETE"
				});

				if (res.status === 204) {
					toast.success("success", {
						description: "that webhook is now deleted"
					});
					form.data.url = "";
					return;
				}
				toast.error("error", {
					description: "that webhook does not exist"
				});
				setError(form, "url", "that webhook does not exist");
				return;
			} catch (err) {
				setError(form, "url", "something went wrong");
			}
		},
		resetForm: false
	});

	const { form: formData, enhance, submitting } = form;
</script>

<form method="POST" use:enhance>
	<Form.Field {form} name="url">
		<Form.Control let:attrs>
			<Form.Label>url</Form.Label>
			<Input
				{...attrs}
				bind:value={$formData.url}
				placeholder="https://discord.com/api/webhooks/[webhook id]"
			/>
		</Form.Control>
		<Form.FieldErrors />
		<Form.Description>the webhook url to destroy</Form.Description>
	</Form.Field>

	<Form.Button disabled={$submitting} variant="destructive">
		{#if $submitting}
			<LoaderCircle class="mr-2 h-4- w-4 animate-spin" />
			destroying...
		{:else}
			destroy
		{/if}
	</Form.Button>
</form>
