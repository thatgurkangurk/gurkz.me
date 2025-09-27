import * as v from "valibot";

export const permissions = [
	"DEFAULT",
	"CREATE_MUSIC_IDS",
	"CREATE_AUTO_VERIFIED_MUSIC_IDS",
	"MANAGE_MUSIC_IDS"
] as const;

export const Permissions = v.picklist(permissions);

export type Permission = v.InferOutput<typeof Permissions>;
