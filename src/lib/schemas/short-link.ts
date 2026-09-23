import * as z from "zod/v4";

export const CreateShortLinkSchema = z.object({
	title: z
		.string({
			error: "please provide a string"
		})
		.min(4, { error: "the title has to be longer than 4 characters" })
		.max(48, { error: "the title has to be shorter than 48 characters" }),
	location: z.url({
		error: "please provide a URL"
	}),
	slug: z.string().min(4).max(64)
});
