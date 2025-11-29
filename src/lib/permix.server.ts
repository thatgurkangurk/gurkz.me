import { createPermix, type PermixDefinition, type PermixRules } from "permix";
import type { MusicId, MusicIdWithCreator } from "./schemas/music";
import { getSession } from "./auth.remote";

type PermissionsDefinition = PermixDefinition<{
	musicId: {
		dataType: MusicId | MusicIdWithCreator;
		action: "create" | "read" | "edit" | "delete";
	};
}>;

async function getRules(): Promise<PermixRules<PermissionsDefinition>> {
	const user = (await getSession())?.user;
	return {
		musicId: {
			read: user?.permissions?.includes("VIEW_MUSIC_IDS") ?? false,
			create: user?.permissions?.includes("CREATE_MUSIC_IDS") ?? false,

			delete: (data) =>
				!!user &&
				((user.id === data?.createdById || user.permissions?.includes("CREATE_MUSIC_IDS")) ??
					false),

			edit: (data) =>
				!!user &&
				((user.id === data?.createdById || user.permissions?.includes("MANAGE_MUSIC_IDS")) ?? false)
		}
	};
}

export const permix = createPermix<PermissionsDefinition>();

export async function setupPermix() {
	permix.setup(await getRules());
}
