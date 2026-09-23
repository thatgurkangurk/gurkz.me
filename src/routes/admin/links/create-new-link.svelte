<script lang="ts">
	import { createShortLink } from "#lib/api/short-links.remote.js";
	import InputErrors from "#lib/components/form/input-errors.svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from "#lib/components/ui/card/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { CreateShortLinkSchema } from "#lib/schemas/short-link.js";
	import { configureForm } from "#lib/remote-form.svelte.js";
	import { toErrors } from "#lib/utils/to-errors.js";

	import { toast } from "svelte-sonner";

	let formEl: HTMLFormElement | undefined = $state.raw();

	const configured = configureForm(() => ({
		form: createShortLink,
		formEl,
		schema: CreateShortLinkSchema,
		navBlockMessage: "you have unsaved changes. are you sure?",
		onresult: ({ success, error, result }) => {
			if (success) {
				toast.success("successfully created");
				formEl?.reset();
			} else if (error) {
				toast.error(error);
			}
		}
	}));

	const { form, attributes, submitting } = $derived(configured());
</script>

<Card class="w-full max-w-md">
	<CardHeader>
		<CardTitle>create a new short link</CardTitle>
	</CardHeader>

	<form bind:this={formEl} {...attributes} enctype="multipart/form-data">
		<CardContent>
			<div>
				<Label class={[!!form.fields.title.issues() && "text-destructive", "pb-2"]}>title</Label>
				<Input
					{...form.fields.title.as("text")}
					aria-errormessage="{form.fields.title.as('text').name}-error"
					aria-invalid={!!form.fields.title.issues()}
				/>

				<InputErrors
					name={form.fields.title.as("text").name}
					errors={toErrors(form.fields.title.issues()?.map((value) => value.message) ?? [])}
				/>
			</div>
			<br />
			<div>
				<Label class={[!!form.fields.location.issues() && "text-destructive", "pb-2"]}
					>location</Label
				>
				<Input
					{...form.fields.location.as("url")}
					aria-errormessage="{form.fields.location.as('url').name}-error"
					aria-invalid={!!form.fields.location.issues()}
				/>

				<InputErrors
					name={form.fields.location.as("url").name}
					errors={toErrors(form.fields.location.issues()?.map((value) => value.message) ?? [])}
				/>
			</div>
			<br />
			<div>
				<Label class={[!!form.fields.slug.issues() && "text-destructive", "pb-2"]}>slug</Label>
				<Input
					{...form.fields.slug.as("text")}
					aria-errormessage="{form.fields.slug.as('url').name}-error"
					aria-invalid={!!form.fields.slug.issues()}
				/>

				<InputErrors
					name={form.fields.slug.as("text").name}
					errors={toErrors(form.fields.slug.issues()?.map((value) => value.message) ?? [])}
				/>
			</div>
		</CardContent>
		<br />
		<CardFooter class="flex flex-row items-center justify-between py-2 ">
			<Button type="submit" disabled={submitting}>create</Button>
		</CardFooter>
	</form>
</Card>
