import { z } from "zod";

export const MedalDownloaderSchema = z.object({
	url: z.url({ error: "please provide a valid url" }).refine(
		(value) => {
			try {
				const parsed = new URL(value);
				return parsed.hostname === "medal.tv";
			} catch {
				return false;
			}
		},
		{ error: "please provide a medal link" }
	)
});
