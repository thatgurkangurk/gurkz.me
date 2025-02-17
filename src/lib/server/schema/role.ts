import { rolesSchema } from "../../roles";
import { pgEnum } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("role", rolesSchema.options);
