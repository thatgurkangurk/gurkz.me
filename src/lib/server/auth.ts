import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { Permissions, type Permission } from "#lib/permissions.js";
import { db } from "#lib/server/db/index.js";
import * as schema from "#lib/server/db/schema.js";
import { apiKey } from "@better-auth/api-key";
import { lastLoginMethod } from "better-auth/plugins";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema,
    }),
    account: {
        accountLinking: {
            disableImplicitLinking: false,
        },
        identityStrategy: "provider-id",
    },
    advanced: {
        ipAddress: {
            ipAddressHeaders: ["cf-connecting-ip"], // CF
        },
    },
    plugins: [
        lastLoginMethod({
            beforeStoreCookie: async (ctx) => {
                const rawConsentCookie = ctx.getCookie("cc_cookie");

                if (!rawConsentCookie) {
                    return false;
                }

                try {
                    const consent = JSON.parse(rawConsentCookie);

                    if (Array.isArray(consent?.categories)) {
                        return consent.categories.includes("preferences");
                    }
                } catch {
                    console.warn("Failed to parse cc_cookie json");
                }

                return false;
            },
        }),
        apiKey({
            enableSessionForAPIKeys: true,
        }),
        tanstackStartCookies(),
    ],
    socialProviders: {
        discord: {
            // @ts-expect-error its fine
            clientId: process.env.DISCORD_CLIENT_ID,

            // @ts-expect-error its fine
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            prompt: "consent",
            overrideUserInfoOnSignIn: true,
            mapProfileToUser: async (profile) => {
                return {
                    username: profile.username,
                    name: profile.global_name || profile.username,
                };
            },
        },
        github: {
            // @ts-expect-error its fine
            clientId: process.env.GITHUB_CLIENT_ID,
            // @ts-expect-error its fine
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            prompt: "consent",
            mapProfileToUser: async (profile) => {
                return {
                    username: profile.login,
                    name: profile.name,
                };
            },
        },
    },
    user: {
        additionalFields: {
            username: {
                type: "string",
                unique: true,
                required: true,
                input: true,
            },
            permissions: {
                type: "string[]",
                required: true,
                defaultValue: ["DEFAULT"],
                input: false,
                fieldName: "permissions",
                validator: {
                    input: Permissions.array(),
                    output: Permissions.array(),
                },
            },
            admin: {
                type: "boolean",
                required: true,
                defaultValue: false,
                input: false,
            },
        },
    },
    // @ts-expect-error its fine
    secret: process.env.BETTER_AUTH_SECRET,
});

export type User = Omit<typeof auth.$Infer.Session.user, "permissions"> & {
    permissions: Permission[];
};
export type Session = typeof auth.$Infer.Session.session;
