"use server";
import { BunSQLDatabase, drizzle } from "drizzle-orm/bun-sql";
import * as musicSchema from "./schema/music-id";
import * as permissionSchema from "./schema/permission";
import * as roleSchema from "./schema/role";
import * as userSchema from "./schema/user";
import * as sessionSchema from "./schema/session";
import * as shortLinkSchema from "./schema/short-link";
import { env } from "~/env";

export const schema = {
	...musicSchema,
	...permissionSchema,
	...roleSchema,
	...userSchema,
	...sessionSchema,
	...shortLinkSchema
};

declare global {
	// eslint-disable-next-line no-var
	var $db: BunSQLDatabase<typeof schema> | undefined;
}

export function getDB(): BunSQLDatabase<typeof schema> {
	if (!globalThis.$db) {
		globalThis.$db = drizzle(env.DATABASE_URL, { schema: schema });
		return globalThis.$db;
	}

	return globalThis.$db;
}
