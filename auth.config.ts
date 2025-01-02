import { db } from "./src/db";
import Discord from "@auth/core/providers/discord";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
    AUTH_SECRET,
    DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET,
} from "astro:env/server";
import { defineConfig } from "auth-astro";

export default defineConfig({
    adapter: DrizzleAdapter(db),
    providers: [
        Discord({
            clientId: DISCORD_CLIENT_ID,
            clientSecret: DISCORD_CLIENT_SECRET,
        }),
    ],
    secret: AUTH_SECRET,
});
