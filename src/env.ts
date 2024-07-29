import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		SITE_URL: z.string().url(),
		AUTH_SECRET: z.string().min(32).max(256),
		DISCORD_CLIENT_ID: z.string(),
		DISCORD_CLIENT_SECRET: z.string(),
	},

	runtimeEnv: process.env,

	emptyStringAsUndefined: true,
});
