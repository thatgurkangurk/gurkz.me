import { type Rules } from "permix";

import type { MusicId } from "./server/db/schema";
import type { User } from "./server/auth";

import { createPermix } from "permix/tanstack-start";

export type PermissionsDefinition = {
    musicId: [
        { name: "create" },
        { name: "read" },
        { name: "update"; type: MusicId; required: true },
        { name: "delete"; type: MusicId; required: true },
        { name: "list" },
    ];
    ttcore: [{ name: "submit" }, { name: "manage" }];
};

export function getRules(user: User | undefined): Rules<PermissionsDefinition> {
    return {
        musicId: {
            list: user?.permissions.includes("VIEW_MUSIC_IDS") ?? false,
            read: user?.permissions.includes("VIEW_MUSIC_IDS") ?? false,
            create: user?.permissions.includes("CREATE_MUSIC_IDS") ?? false,
            delete: (music) => {
                const isAdmin = Boolean(user?.admin);
                const isCreator = music.createdById === user?.id;
                const canManage =
                    user?.permissions?.includes("MANAGE_MUSIC_IDS");

                return isAdmin || isCreator || Boolean(canManage);
            },
            update: (music) => {
                const isAdmin = Boolean(user?.admin);
                const isCreator = music.createdById === user?.id;
                const canManage =
                    user?.permissions?.includes("MANAGE_MUSIC_IDS");

                return isAdmin || isCreator || Boolean(canManage);
            },
        },
        ttcore: {
            submit: Boolean(user),
            manage: Boolean(
                user?.admin || user?.permissions?.includes("TTCORE_ADMIN"),
            ),
        },
    };
}

export const permix = createPermix<PermissionsDefinition>();
