import * as z from "zod/v4";

export const SetNewDisplayNameSchema = z.object({
	displayName: z
		.string({
			error: "please provide a display name"
		})
		.min(1, { error: "please provide a display name" })
		.min(4, { error: "your display name has to be longer than 4 characters" })
		.max(48, { error: "your display name has to be shorter than 48 characters" })
});
