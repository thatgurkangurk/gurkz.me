import { z } from "zod";

export const VideoMessageSchema = z
	.string({
		error: "please provide a string"
	})
	.min(4, { error: "the message has to be longer than 4 characters" })
	.max(512, { error: "the message has to be shorter than 512 characters" });

export const CreateNewVideoSchema = z.object({
	title: z
		.string({
			error: "please provide a string"
		})
		.min(4, { error: "the title has to be longer than 4 characters" })
		.max(48, { error: "the title has to be shorter than 48 characters" }),

	message: VideoMessageSchema.optional()
});
