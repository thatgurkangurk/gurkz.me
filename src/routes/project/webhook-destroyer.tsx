import {
	createForm,
	FormError,
	reset,
	type SubmitHandler,
	zodForm,
} from "@modular-forms/solid";
import { LoaderCircle } from "lucide-solid";
import { Show } from "solid-js";
import { toast } from "solid-sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	TextField,
	TextFieldDescription,
	TextFieldErrorMessage,
	TextFieldLabel,
	TextFieldRoot,
} from "~/components/ui/textfield";

const formSchema = z.object({
	url: z
		.string()
		.url("you need to provide a valid URL.")
		.regex(
			/^(https:\/\/(?:discord\.com|ptb\.discord\.com|canary\.discord\.com)\/api\/webhooks\/)(?:.*)$/,
			"please enter a discord webhook url",
		),
});

type FormSchema = z.infer<typeof formSchema>;

function DestroyerForm() {
	const [destroyerForm, { Form, Field }] = createForm<FormSchema>({
		validate: zodForm(formSchema),
	});

	const handleSubmit: SubmitHandler<FormSchema> = async (values) => {
		try {
			const res = await fetch(values.url, {
				method: "DELETE",
			});

			if (res.status === 204) {
				toast.success("success", {
					description: "that webhook is now deleted",
				});
				reset(destroyerForm);
				return;
			}

			toast.error("error", {
				description: "that webhook doesn't exist",
			});

			throw new FormError<FormSchema>({
				url: "that webhook doesn't exist",
			});
		} catch (err) {
			throw new FormError<FormSchema>({
				url: "that webhook doesn't exist",
			});
		}
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Field name="url">
				{(field, props) => (
					<TextFieldRoot
						class="w-full max-w-xs"
						validationState={field.error ? "invalid" : "valid"}
					>
						<TextFieldLabel>webhook url</TextFieldLabel>
						<TextField
							value={field.value || ""}
							{...props}
							type="url"
							required
						/>
						<TextFieldDescription>the url to destroy</TextFieldDescription>
						<Show when={field.error}>
							<TextFieldErrorMessage>{field.error}</TextFieldErrorMessage>
						</Show>
					</TextFieldRoot>
				)}
			</Field>
			<Button
				type="submit"
				variant={"destructive"}
				disabled={destroyerForm.submitting}
			>
				<Show when={destroyerForm.submitting} fallback={<>destroy</>}>
					<LoaderCircle class="h-6 w-6 animate-spin" /> destroying
				</Show>
			</Button>
		</Form>
	);
}

export default function WebhookDestroyer() {
	return (
		<Card class="w-fit">
			<CardHeader>
				<CardTitle>webhook destroyer</CardTitle>
				<CardDescription>
					use this form to delete a discord webhook
				</CardDescription>
			</CardHeader>

			<CardContent>
				<DestroyerForm />
			</CardContent>
		</Card>
	);
}
