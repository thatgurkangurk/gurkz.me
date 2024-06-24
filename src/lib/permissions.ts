import type { User } from "lucia";
import type { Permission } from "./schema/user";

export function hasPermission(
  permission: Permission,
  user: User | null
): boolean {
  if (!user) return false;

  if (user.permissions.includes(permission)) return true;

  return false;
}
