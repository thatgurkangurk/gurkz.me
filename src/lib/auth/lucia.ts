import { Lucia } from "lucia";
import { db } from "../db";
import { sessions } from "../schema/session";
import { users } from "../schema/user";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import type { InferSelectModel } from "drizzle-orm";

export const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD,
    },
  },
  getUserAttributes(databaseUserAttributes) {
    return {
      discordId: databaseUserAttributes.discordId,
      username: databaseUserAttributes.username,
      profilePictureUrl: databaseUserAttributes.profilePictureUrl,
      email: databaseUserAttributes.email,
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
