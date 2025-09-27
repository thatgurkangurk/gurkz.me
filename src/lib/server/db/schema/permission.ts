import { permissions } from "$lib/permissions";
import { pgEnum } from "drizzle-orm/pg-core";

export const permissionsEnum = pgEnum("permission", permissions);
