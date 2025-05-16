import { pgEnum } from "drizzle-orm/pg-core";
import * as permissions from "~/lib/permissions";

export const permissionsEnum = pgEnum("permission", permissions.options);