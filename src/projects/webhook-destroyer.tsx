import { Card } from "~/components/card";
import { Input } from "~/components/ui/input";
import { createForm, zodForm, type SubmitHandler, FormError, reset, setResponse } from "@modular-forms/solid";
import { Show, createSignal } from "solid-js";
import { z } from "zod";

const formSchema = z.object({
	url: z
		.string()
		.url("you need to provide a valid URL.")
		.regex(
			/^(https:\/\/(?:discord\.com|ptb\.discord\.com|canary\.discord\.com)\/api\/webhooks\/)(?:.*)$/, // last time im ever writing a regex, this was hell
			"please enter a discord webhook url",
		),
});

type UrlForm = z.infer<typeof formSchema>;

export function WebhookDestroyer() {
	const [urlForm, { Form, Field }] = createForm<UrlForm>({
		validate: zodForm(formSchema),
	});
	const [buttonText, setButtonText] = createSignal("destroy it");

	const handleSubmit: SubmitHandler<UrlForm> = async (values) => {
		setButtonText("wait");
		fetch(values.url, {
			method: "DELETE",
		})
			.catch(() => {
				setButtonText("destroy it");
				throw new FormError<UrlForm>("something went wrong when trying to delete.");
			})
			.then((res) => {
				reset(urlForm);

				if (res.status === 204) {
					setResponse(urlForm, {
						status: "success",
						message: "webhook has been deleted",
					});
				} else {
					setResponse(urlForm, {
						status: "error",
						message: "that webhook does not exist",
					});
				}
			});
		setButtonText("destroy it");
	};

	return (
		<>
			<Show when={urlForm.response.status === "error"}>
				<Card type="error">{urlForm.response.message}</Card>
			</Show>
			<Show when={urlForm.response.status === "success"}>
				<Card type="success">{urlForm.response.message}</Card>
			</Show>
			<Form onSubmit={handleSubmit}>
				<Field name="url">
					{(field, props) => (
						<>
							<Input
								{...props}
								value={field.value || ""}
								type="url"
								placeholder="https://discord.com/"
								class={`w-[90%] ${field.error ? "ring-red" : ""}`}
								style={{ "font-family": "inherit" }}
								required
							/>
							{field.error && <p class="text-red">{field.error}</p>}
						</>
					)}
				</Field>
				<button
					class="mt-2 w-fit rounded-md bg-red-500 px-4 py-2 text-[1.2rem]"
					style={{ "font-family": "inherit" }}
					disabled={urlForm.submitting}
				>
					{buttonText()}
				</button>
			</Form>
		</>
	);
}
