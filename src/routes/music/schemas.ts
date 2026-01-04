import * as z from "zod/v4";

export const musicSearchSchema = z.object({
	search: z.string().default("")
});

export const createMusicIdSchema = z.object({
	name: z
		.string()
		.min(6, {
			error: "the name has to be longer than 6 characters"
		})
		.max(128, {
			error: "the name has to be shorter than 128 characters"
		}),
	robloxId: z
		.string({
			error: "please provide a string"
		})
		.min(4, {
			error: "id has to be longer than 4 characters"
		})
		.max(24, {
			error: "id has to be shorter than 24 characters"
		})
		.regex(/^\d+$/, {
			message: "you have to provide only numbers"
		}),
	tags: z
		.array(
			z
				.string({
					error: "you have to provide a tag value"
				})
				.min(4, {
					error: "the tag has to be longer than 4 characters"
				})
				.max(24, {
					error: "the tag has to be shorter than 24 characters"
				})
		)
		.max(4, {
			error: "you can only include a maximum of 4 tags"
		})
});
