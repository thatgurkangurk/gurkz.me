import { permissionsSchema, type Permission } from "./permissions";
import { rolesSchema, type Role } from "./roles";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "~/db";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders: {
        discord: {
            clientId: import.meta.env.DISCORD_CLIENT_ID,
            clientSecret: import.meta.env.DISCORD_CLIENT_SECRET,
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

export type Session = (typeof auth.$Infer.Session)["session"];
export type User = {
    permissions: Permission[];
    role: Role;
} & (typeof auth.$Infer.Session)["user"];
