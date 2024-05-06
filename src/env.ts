import { createEnv } from "@t3-oss/env-core";
import { env as privateEnv } from "$env/dynamic/private";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		DISCORD_CLIENT_ID: z.string().min(3),
		DISCORD_CLIENT_SECRET: z.string().min(5),
		CALLBACK_URI: z.string().url()
	},
	runtimeEnvStrict: {
		DATABASE_URL: privateEnv.DATABASE_URL,
		DISCORD_CLIENT_ID: privateEnv.DISCORD_CLIENT_ID,
		DISCORD_CLIENT_SECRET: privateEnv.DISCORD_CLIENT_SECRET,
		CALLBACK_URI: privateEnv.CALLBACK_URI
	},
	skipValidation: process.env.CI === 1
});
