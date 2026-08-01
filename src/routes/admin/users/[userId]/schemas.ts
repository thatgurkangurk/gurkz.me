import { permissions, type Permission } from "$lib/permissions";
import * as z from "zod/v4";

export type NonDefaultPermission = Exclude<Permission, "DEFAULT">;

export const nonDefaultPermissions = permissions.filter(
	(p): p is NonDefaultPermission => p !== "DEFAULT"
) as [NonDefaultPermission, ...NonDefaultPermission[]];

const NonDefaultPermissionsEnum = z.enum(nonDefaultPermissions);

const permissionShape = Object.fromEntries(
	nonDefaultPermissions.map((p) => [p, z.coerce.boolean<boolean>().default(false)])
) as Record<NonDefaultPermission, z.ZodDefault<z.ZodBoolean>>;

// 2. Combine into your final schema
export const SetUserPermissions = z.object({
	...permissionShape,
	userId: z.string()
});
