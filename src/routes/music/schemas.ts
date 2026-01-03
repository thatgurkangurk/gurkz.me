import * as z from "zod/v4";

export const musicSearchSchema = z.object({
	search: z.string().default("")
});
