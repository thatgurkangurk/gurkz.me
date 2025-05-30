import { z } from "zod/v4";

export const MusicId = z.object({
	id: z.string(),
	name: z.string(),
	robloxId: z.string(),
	createdById: z.string(),
	created: z.date(),
	working: z.boolean(),
	verified: z.boolean(),
	tags: z.string().array(),
	creator: z.object({
		id: z.string(),
		name: z.string(),
		image: z.string().nullable()
	})
});

export type MusicId = z.infer<typeof MusicId>;
