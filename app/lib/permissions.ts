import { z } from "zod/v4";

export const Permissions = z.enum([
	"DEFAULT",
	"CREATE_MUSIC_IDS",
	"MANAGE_MUSIC_IDS",
	"CREATE_SHORT_LINKS"
]);

export type Permission = z.infer<typeof Permissions>;
