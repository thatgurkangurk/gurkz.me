import { createEnv } from "@t3-oss/env-core";
import * as v from "valibot";
import { process } from "std-env";

export const env = createEnv({
	server: { DATABASE_URL: v.string() },
	runtimeEnvStrict: { DATABASE_URL: process.env.DATABASE_URL },
	skipValidation: process.env.CI === "1"
});
