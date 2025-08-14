import { createForm } from "@tanstack/svelte-form";
import { z } from "zod/v4";
import { char, createRegExp, exactly } from "magic-regexp";
import { toast } from "svelte-sonner";

const formSchema = z.object({
	url: z
		.url("please provide a valid URL")
		.regex(
			createRegExp(
				exactly(
					"https://",
					exactly("discord.com").or("ptb.discord.com").or("canary.discord.com"),
					"/api/webhooks/"
				)
					.grouped()
					.at.lineStart(),
				char.times.any().at.lineEnd()
			),
			"please provide a discord webhook URL"
		)
});

export class WebhookDestroyerState {
	#form;

	constructor(id: string) {
		this.#form = createForm(() => ({
			formId: id,
			defaultValues: {
				url: ""
			},
			validators: {
				onChange: formSchema
			},
			onSubmit: async ({ value, formApi }) => {
				const res = await fetch(value.url, {
					method: "delete"
				});

				if (!res.ok) {
					formApi.state.fieldMeta.url.errors.push({
						message: "that webhook does not exist"
					});
					return;
				}

				toast.success("done", {
					description: "the webhook has been deleted",
					position: "top-center"
				});
			}
		}));
	}

	get form() {
		return this.#form;
	}
}
