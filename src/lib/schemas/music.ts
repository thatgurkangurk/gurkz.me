import { z } from "zod/v4";
import { User } from "./user";

export const MusicId = z.object({
	id: z.ulid(),
	robloxId: z
		.string()
		.describe(
			"the sound id you use in a game - might not be safe to parse as a JS number (too big)"
		),
	createdById: z.string().describe("creator user id"),
	name: z.string(),
	created: z.date(),
	working: z.boolean(),
	verified: z.boolean(),
	tags: z.string().array()
});

export const MusicIdWithCreator = MusicId.extend({
	creator: User.pick({
		id: true,
		image: true,
		name: true
	})
});

export type MusicId = z.infer<typeof MusicId>;
export type MusicIdWithCreator = z.infer<typeof MusicIdWithCreator>;
