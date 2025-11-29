import { pgEnum } from "drizzle-orm/pg-core";
import { permissions } from "~/lib/permissions";

export const permissionsEnum = pgEnum("permission", permissions);
