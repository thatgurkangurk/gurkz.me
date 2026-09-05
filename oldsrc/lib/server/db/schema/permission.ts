//! DO NOT CHANGE THIS TO BE $lib/permissions.js !!! drizzle-kit fails then
import { permissions } from "../../../permissions.js";
import { pgEnum } from "drizzle-orm/pg-core";

export const permissionsEnum = pgEnum("permission", permissions);
