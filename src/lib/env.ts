import { createEnv } from "@t3-oss/env-core";
import * as v from "valibot";
import { process } from "std-env";
import { env as privateEnv } from '$env/dynamic/private';

export const env = createEnv({
	server: {
		DATABASE_URL: v.string(),
		REMOTE_AUTH_HOST: v.pipe(v.string(), v.url()),
		PASSPORT_CLIENT_ID: v.string()
	},
	runtimeEnvStrict: {
		DATABASE_URL: privateEnv.DATABASE_URL,
		REMOTE_AUTH_HOST: privateEnv.REMOTE_AUTH_HOST,
		PASSPORT_CLIENT_ID: privateEnv.PASSPORT_CLIENT_ID
	},
	skipValidation: process.env.CI === "1"
});
