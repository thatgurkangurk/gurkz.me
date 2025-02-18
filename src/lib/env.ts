import { createEnv } from "@t3-oss/env-core";
import * as v from "valibot";
import { process } from "std-env";
import { env } from '$env/dynamic/private';

export const env = createEnv({
	server: {
		DATABASE_URL: v.string(),
		REMOTE_AUTH_HOST: v.pipe(v.string(), v.url()),
		PASSPORT_CLIENT_ID: v.string()
	},
	runtimeEnvStrict: {
		DATABASE_URL: env.DATABASE_URL,
		REMOTE_AUTH_HOST: env.REMOTE_AUTH_HOST,
		PASSPORT_CLIENT_ID: env.PASSPORT_CLIENT_ID
	},
	skipValidation: process.env.CI === "1"
});
