import * as z from "zod/v4";

export const CreateNewApiKeySchema = z.object({
	name: z
		.string({
			error: "please provide a name"
		})
		.min(4, { error: "the name has to be longer than 4 characters" })
		.max(24, { error: "the name has to be shorter than 24 characters" })
});

export const DeleteApiKeySchema = z.object({
	keyId: z.string()
});
