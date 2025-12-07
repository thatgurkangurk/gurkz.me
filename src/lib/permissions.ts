import * as z from "zod/v4";

export const permissions = [
	"DEFAULT",
	"VIEW_MUSIC_IDS",
	"CREATE_MUSIC_IDS",
	"MANAGE_MUSIC_IDS",
] as const;

export const Permissions = z.enum(permissions);

export type Permission = z.output<typeof Permissions>;
