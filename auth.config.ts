import { db } from "./src/db";
import * as schema from "./src/db/schema";
import Discord from "@auth/core/providers/discord";
import {
    AUTH_SECRET,
    DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET,
} from "astro:env/server";
import { defineConfig } from "auth-astro";
import { CustomDrizzleAdapter } from "~/lib/auth/adapter";

export default defineConfig({
    adapter: CustomDrizzleAdapter(db, schema),
    providers: [
        Discord({
            clientId: DISCORD_CLIENT_ID,
            clientSecret: DISCORD_CLIENT_SECRET,
            async profile(profile) {
                return {
                    id: profile.id,
                    email: profile.email,
                    name: profile.username,
                    image: profile.avatar,
                };
            },
        }),
    ],
    callbacks: {
        session: async ({ session }) => {
            return session;
        },
    },
    secret: AUTH_SECRET,
});
