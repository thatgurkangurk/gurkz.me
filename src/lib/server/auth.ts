import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, user } from "../permissions";
import { env } from "$env/dynamic/private";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg"
	}),
	socialProviders: {
		discord: {
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET
		}
	},
	plugins: [
		adminPlugin({
			ac,
			roles: {
				admin,
				user
			}
		})
	]
});
