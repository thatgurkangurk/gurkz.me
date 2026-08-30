import { permissions, type Permission } from "#lib/permissions.js";
import * as z from "zod/v4";

export type NonDefaultPermission = Exclude<Permission, "DEFAULT">;

export const nonDefaultPermissions = permissions.filter(
	(p): p is NonDefaultPermission => p !== "DEFAULT"
) as [NonDefaultPermission, ...NonDefaultPermission[]];

const permissionShape = Object.fromEntries(
	nonDefaultPermissions.map((p) => [p, z.coerce.boolean<boolean>().default(false)])
) as Record<NonDefaultPermission, z.ZodDefault<z.ZodBoolean>>;

export const SetUserPermissions = z.object({
	...permissionShape,
	userId: z.string()
});
