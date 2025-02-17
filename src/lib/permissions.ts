import * as v from "valibot";

export const permissionsSchema = v.picklist([
	"DEFAULT",
	"CREATE_MUSIC_IDS",
	"MANAGE_MUSIC_IDS",
	"CREATE_SHORT_LINKS"
]);

export type Permission = v.InferOutput<typeof permissionsSchema>;
