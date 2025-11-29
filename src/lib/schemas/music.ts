import * as v from "valibot";
import { User } from "./user";

export const MusicId = v.object({
	id: v.pipe(v.string(), v.ulid()),
	robloxId: v.pipe(
		v.string(),
		v.description(
			"the sound id you use in a game - might not be safe to parse as a JS number (too big)"
		)
	),
	createdById: v.pipe(v.string(), v.description("creator user id")),
	name: v.string(),
	created: v.date(),
	working: v.boolean(),
	tags: v.array(v.string())
});

export const MusicIdWithCreator = v.object({
	...MusicId.entries,

	creator: v.pick(User, ["id", "image", "name"])
});

export type MusicId = v.InferOutput<typeof MusicId>;
export type MusicIdWithCreator = v.InferOutput<typeof MusicIdWithCreator>;
