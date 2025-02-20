import { permissionsSchema } from "../../permissions";
import { pgEnum } from "drizzle-orm/pg-core";

export const permissionsEnum = pgEnum("permission", permissionsSchema.options);
