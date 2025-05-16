import * as roles from "~/lib/roles";
import { pgEnum } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("role", roles.options);
