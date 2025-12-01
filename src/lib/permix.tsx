import { createPermix, type PermixDefinition, type PermixRules } from "permix";
import type { MusicId, MusicIdWithCreator } from "~/server/db/schema/music";
import type { Session, User } from "~/server/auth";
import { createComponents, usePermix } from "permix/react";

export type PermissionsDefinition = PermixDefinition<{
  musicId: {
    dataType: MusicId | MusicIdWithCreator;
    action: "view" | "create" | "edit" | "delete";
  };
}>;

export function getRules(
  session: {
    session: Session;
    user: User;
  } | null
): PermixRules<PermissionsDefinition> {
  const user = session?.user;

  return {
    musicId: {
      view: !!user?.permissions.includes("VIEW_MUSIC_IDS"),
      create: user?.permissions?.includes("CREATE_MUSIC_IDS") ?? false,

      delete: (data) =>
        !!user &&
        ((user.id === data?.createdById ||
          user.permissions?.includes("CREATE_MUSIC_IDS")) ??
          false),

      edit: (data) =>
        !!user &&
        ((user.id === data?.createdById ||
          user.permissions?.includes("MANAGE_MUSIC_IDS")) ??
          false),
    },
  };
}

export const permix = createPermix<PermissionsDefinition>();

export const { Check } = createComponents(permix);

export function usePermissions() {
  return usePermix(permix);
}
