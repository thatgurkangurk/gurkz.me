import { z } from "zod";

export const webhookDestroyerSchema = z.object({
	url: z
		.string()
		.url("you need to provide a valid URL.")
		.regex(
			/^(https:\/\/(?:discord\.com|ptb\.discord\.com|canary\.discord\.com)\/api\/webhooks\/)(?:.*)$/, // last time im ever writing a regex, this was hell
			"please enter a discord webhook url"
		)
});
