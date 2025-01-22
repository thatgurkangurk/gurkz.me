import { db } from "./db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "~/env";
import { permissionsSchema } from "~/lib/permissions";
import { rolesSchema } from "~/lib/roles";

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
