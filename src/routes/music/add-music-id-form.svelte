<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import { toast } from "svelte-sonner";
	import { formSchema, type FormSchema } from "./validation";
	import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema),
		onResult({ result }) {
			switch (result.type) {
				case "success": {
					toast.success("Successfully created");
					break;
				}
				case "error": {
					toast.error("Something unexpected went wrong.");
					break;
				}
				case "failure": {
					switch (result.status) {
						case 403: {
							toast.error("You do not have permission to create new IDs");
							break;
						}
						default: {
							toast.error("Please fix the field errors.");
							break;
						}
					}

					break;
				}
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance action="?/create">
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.Description>Give the ID a name that describes the sound</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="id">
		<Form.Control let:attrs>
			<Form.Label>Music ID</Form.Label>
			<Input type="number" {...attrs} bind:value={$formData.id} />
		</Form.Control>
		<Form.Description>This is the ID that you use in (for example: boomboxes)</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Create</Form.Button>
</form>
