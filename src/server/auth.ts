import { CustomDrizzleAdapter } from "./auth/adapter";
import { db } from "./db";
import Discord from "@auth/core/providers/discord";
import { type SolidAuthConfig } from "@solid-mediakit/auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "~/env";
import { Permission, permissionsSchema } from "~/lib/permissions";
import { Role, rolesSchema } from "~/lib/roles";
import * as schema from "~/server/db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    socialProviders: {
        discord: {
            clientId: env.DISCORD_CLIENT_ID,
            clientSecret: env.DISCORD_CLIENT_SECRET,
        },
    },
    user: {
        additionalFields: {
            permissions: {
                type: "string[]",
                input: false,
                required: true,
                defaultValue: ["DEFAULT"],
                validator: {
                    input: permissionsSchema,
                    output: permissionsSchema,
                },
                returned: true,
            },
            role: {
                type: "string",
                input: false,
                required: true,
                defaultValue: "USER",
                validator: {
                    input: rolesSchema,
                    output: rolesSchema,
                },
                returned: true,
            },
        },
    },
});

export const authOptions: SolidAuthConfig = {
    providers: [
        Discord({
            clientId: env.DISCORD_CLIENT_ID,
            clientSecret: env.DISCORD_CLIENT_SECRET,
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
    basePath: "/api/auth",
    adapter: CustomDrizzleAdapter(db, schema),
    secret: env.BETTER_AUTH_SECRET,
};

declare module "@auth/core/types" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            permissions: Permission[];
            role: Role;
        } & DefaultSession["user"];
    }
}
