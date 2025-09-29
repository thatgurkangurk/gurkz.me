import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { env } from "$env/dynamic/private";
import { z } from "zod";
import { Permissions } from "$lib/permissions";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg"
	}),
	plugins: [sveltekitCookies(getRequestEvent)],
	socialProviders: {
		discord: {
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET
		}
	},
	user: {
		additionalFields: {
			permissions: {
				type: "string[]",
				required: true,
				defaultValue: ["DEFAULT"],
				input: false,
				fieldName: "permissions",
				validator: {
					// this for some reason only accepts zod
					input: z.enum(Permissions.options).array(),
					output: z.enum(Permissions.options).array()
				}
			}
		}
	}
});

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
