import { z } from "zod";

export const SongsSchema = z
	.array(
		z
			.string({
				error: "please provide a string"
			})
			.min(1, { error: "please provide a value" })
			.min(8, { error: "please provide a value longer than 8 characters" })
			.max(64, { error: "please provide a value shorter than 64 characters" })
	)
	.max(12, { error: "why do you have more than 12 songs in one video" });
