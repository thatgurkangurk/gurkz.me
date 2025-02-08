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
        UPSTASH_REDIS_URL: z.string().url(),
        UPSTASH_REDIS_TOKEN: z.string(),
    },

    runtimeEnvStrict: {
        DATABASE_URL: process.env.DATABASE_URL,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
        DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
        REMOTE_AUTH_HOST: process.env.REMOTE_AUTH_HOST,
        PASSPORT_CLIENT_ID: process.env.PASSPORT_CLIENT_ID,
        UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_REST_URL,
        UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    },

    emptyStringAsUndefined: true,
});
