import { createPermix, type Rules } from "permix";
import { usePermix as libUsePermix } from "permix/svelte";
import type { MusicIdWithCreator } from "./server/db/schema";
import type { User } from "./server/auth";

type PermissionsDefinition = {
	musicId: [
		{ name: "create" },
		{ name: "read" },
		{ name: "update"; type: MusicIdWithCreator; required: true },
		{ name: "delete"; type: MusicIdWithCreator; required: true },
		{ name: "list" }
	];
};

export function getRules(user: User | undefined): Rules<PermissionsDefinition> {
	return {
		musicId: {
			list: user?.permissions.includes("VIEW_MUSIC_IDS") ?? false,
			read: user?.permissions.includes("VIEW_MUSIC_IDS") ?? false,
			create: user?.permissions.includes("CREATE_MUSIC_IDS") ?? false,
			delete: (musicId) => musicId.createdById === user?.id,
			update: (musicId) => musicId.createdById === user?.id
		}
	};
}

export const permix = createPermix<PermissionsDefinition>();

export function usePermix() {
	return libUsePermix(permix);
}
