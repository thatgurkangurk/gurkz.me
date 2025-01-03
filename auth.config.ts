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
        session: async ({ session, user }) => {
            const dbUser = await db.query.users.findFirst({
                where: (table, { eq }) => eq(table.id, user.id),
                columns: {
                    permissions: true,
                    role: true,
                },
            });
            return {
                ...session,
                user: {
                    ...session.user,
                    permissions: dbUser?.permissions,
                    role: dbUser?.role,
                    id: user.id,
                },
            };
        },
    },
    secret: AUTH_SECRET,
});
