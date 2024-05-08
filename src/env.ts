import { createEnv } from "@t3-oss/env-core";
import { env as privateEnv } from "$env/dynamic/private";
import { env as publicEnv } from "$env/dynamic/public";
import { z } from "zod";

export const env = createEnv({
	clientPrefix: "PUBLIC_",
	client: {
		PUBLIC_BACKEND_URL: z.string().url()
	},
	runtimeEnvStrict: {
		PUBLIC_BACKEND_URL: publicEnv.PUBLIC_BACKEND_URL
	},
	skipValidation: privateEnv.CI === "1"
});
