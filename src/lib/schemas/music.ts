import * as z from "zod/v4";

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	image: z.string().nullable()
});

export const musicIdSchema = z.object({
	id: z.string(),
	robloxId: z.string(),
	createdById: z.string(),
	name: z.string().max(128),
	createdAt: z.date(),
	working: z.boolean().default(true),
	tags: z.array(z.string()).default([])
});

export const musicIdWithCreatorSchema = musicIdSchema.extend({
	creator: userSchema.pick({
		id: true,
		name: true,
		image: true
	})
});
