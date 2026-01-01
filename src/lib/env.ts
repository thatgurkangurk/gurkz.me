import { createEnv } from "@t3-oss/env-core";
import { env as stdEnv } from "std-env";
import * as z from "zod/v4";

export const env = createEnv({
	server: {
		DATABASE_URL: z.url(),
		BETTER_AUTH_SECRET: z.string(),
		DISCORD_CLIENT_ID: z.string(),
		DISCORD_CLIENT_SECRET: z.string(),
		BETTER_AUTH_URL: z.string(),
		GITHUB_CLIENT_ID: z.string(),
		GITHUB_CLIENT_SECRET: z.string()
	},
	client: {},
	clientPrefix: "VITE_",
	runtimeEnv: stdEnv
});
