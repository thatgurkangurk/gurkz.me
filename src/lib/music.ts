import { z } from "zod";

export const createIdSchema = z.object({
	id: z
		.string()
		.min(4, {
			message: "id has to be longer than 4 characters",
		})
		.max(24, {
			message: "id has to be shorter than 24 characters",
		}),
	name: z
		.string()
		.min(6, {
			message: "the name has to be longer than 6 characters",
		})
		.max(128, {
			message: "the name has to be shorter than 128 characters",
		}),
});
