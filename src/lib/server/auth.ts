import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { Permissions, type Permission } from "$lib/permissions";
import { db } from "$lib/server/db";
import { getRequestEvent } from "$app/server";
import * as env from "$app/env/private";
import * as schema from "$lib/server/db/schema.js";
import { apiKey } from "@better-auth/api-key";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema
	}),
	advanced: {
		ipAddress: {
			ipAddressHeaders: ["cf-connecting-ip"] // CF
		}
	},
	plugins: [apiKey(), sveltekitCookies(getRequestEvent)],
	socialProviders: {
		discord: {
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
			prompt: "consent",
			overrideUserInfoOnSignIn: true,
			mapProfileToUser: async (profile) => {
				return {
					username: profile.username,
					name: profile.global_name || profile.username
				};
			}
		},
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
			prompt: "consent",
			mapProfileToUser: async (profile) => {
				return {
					username: profile.login,
					name: profile.name
				};
			}
		}
	},
	user: {
		additionalFields: {
			username: {
				type: "string",
				unique: true,
				required: true,
				input: false
			},
			permissions: {
				type: "string[]",
				required: true,
				defaultValue: ["DEFAULT"],
				input: false,
				fieldName: "permissions",
				validator: {
					input: Permissions.array(),
					output: Permissions.array()
				}
			},
			admin: {
				type: "boolean",
				required: true,
				defaultValue: false,
				input: false
			}
		}
	},
	secret: env.BETTER_AUTH_SECRET
});

export type User = Omit<typeof auth.$Infer.Session.user, "permissions"> & {
	permissions: Permission[];
};
export type Session = typeof auth.$Infer.Session.session;
