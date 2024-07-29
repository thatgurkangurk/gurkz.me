import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "./db";
import { sessions } from "./schema/session";
import { users } from "./schema/user";
import { Lucia } from "lucia";
import { isDev } from "solid-js/web";
import type { InferSelectModel } from "drizzle-orm";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !isDev,
		},
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
