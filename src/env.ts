import { createEnv } from "@t3-oss/env-core";
import { process } from "std-env";
import { type } from "arktype";

export const env = createEnv({
	server: {
		DATABASE_URL: type("string"),
		REMOTE_AUTH_HOST: type("string.url"),
		PASSPORT_CLIENT_ID: type("string")
	},

	runtimeEnvStrict: {
		DATABASE_URL: process.env.DATABASE_URL,
		REMOTE_AUTH_HOST: process.env.REMOTE_AUTH_HOST,
		PASSPORT_CLIENT_ID: process.env.PASSPORT_CLIENT_ID
	},

	skipValidation: process.env.CI === "1"
});
