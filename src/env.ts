import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().url(),
        BETTER_AUTH_SECRET: z.string(),
        BETTER_AUTH_URL: z.string(),
        DISCORD_CLIENT_ID: z.string(),
        DISCORD_CLIENT_SECRET: z.string(),
        REMOTE_AUTH_HOST: z.string().url(),
        PASSPORT_CLIENT_ID: z.string(),
    },

    clientPrefix: "VITE_",

    client: {
        VITE_IS_PREVIEW: z.string().min(1).max(1),
    },

    runtimeEnv: process.env,

    emptyStringAsUndefined: true,
});
