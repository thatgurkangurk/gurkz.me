import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, user } from "../permissions";
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from "$env/static/private";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg"
	}),
	socialProviders: {
		discord: {
			clientId: DISCORD_CLIENT_ID,
			clientSecret: DISCORD_CLIENT_SECRET
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
