import { Lucia } from "lucia";
import { dev } from "$app/environment";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "./db";
import { sessions } from "./schema/session";
import { users } from "./schema/user";
import type { InferSelectModel } from "drizzle-orm";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users); // your adapter

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	},
    getUserAttributes(databaseUserAttributes) {
		return {
			discordId: databaseUserAttributes.discordId,
			username: databaseUserAttributes.username,
			profilePictureUrl: databaseUserAttributes.profilePictureUrl,
			email: databaseUserAttributes.email,
			permissions: databaseUserAttributes.permissions,
		};
	},
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

export type DatabaseUserAttributes = InferSelectModel<typeof users>;