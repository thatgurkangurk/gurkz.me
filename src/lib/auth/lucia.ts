import { Lucia } from "lucia";
import { dev } from "$app/environment";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "$lib/db/client";
import { users } from "$lib/db/schema/user";
import { sessions } from "$lib/db/schema/session";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes(attributes) {
		return {
			username: attributes.username,
			email: attributes.email,
			discordId: attributes.discordId
		};
	}
});

type DatabaseUserAttributes = {
	discordId?: number;
	username: string;
	email: string;
};

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}
