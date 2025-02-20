import * as v from "valibot";

export const creator = v.object({
	id: v.string(),
	name: v.nullable(v.string()),
	image: v.nullable(v.string())
});

export const musicId = v.object({
	id: v.string(),
	name: v.string(),
	robloxId: v.string(),
	createdById: v.string(),
	created: v.date(),
	working: v.boolean(),
	verified: v.boolean(),
	creator: creator,
	tags: v.array(v.string())
});

export type MusicId = v.InferOutput<typeof musicId>;
export type Creator = v.InferOutput<typeof creator>;
