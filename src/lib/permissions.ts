import { z } from "zod/v4";

export const options = [
	"DEFAULT",
	"CREATE_MUSIC_IDS",
	"MANAGE_MUSIC_IDS",
	"CREATE_SHORT_LINKS"
] as const;

export const Permissions = z.enum(options);

export type Permission = z.infer<typeof Permissions>;
