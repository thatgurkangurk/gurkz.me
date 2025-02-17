import { env } from "$lib/env";
import { drizzle } from "drizzle-orm/bun-sql";
import * as musicSchema from "./schema/music-id";
import * as permissionSchema from "./schema/permission";
import * as roleSchema from "./schema/role";
import * as userSchema from "./schema/user";
import * as sessionSchema from "./schema/session";
import * as shortLinkSchema from "./schema/short-link";

export const schema = {
	...musicSchema,
	...permissionSchema,
	...roleSchema,
	...userSchema,
	...sessionSchema,
	...shortLinkSchema
};

export const db = drizzle(env.DATABASE_URL, { schema: schema });
