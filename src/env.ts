import { createEnv } from "@t3-oss/env-core";
import { process } from "std-env";
import { z } from "zod/v4";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string(),
		REMOTE_AUTH_HOST: z.url(),
		PASSPORT_CLIENT_ID: z.string()
	},

	runtimeEnvStrict: {
		DATABASE_URL: process.env.DATABASE_URL,
		REMOTE_AUTH_HOST: process.env.REMOTE_AUTH_HOST,
		PASSPORT_CLIENT_ID: process.env.PASSPORT_CLIENT_ID
	},

	skipValidation: process.env.CI === "1"
});
