import type { InferSelectModel } from "drizzle-orm";
import type { User } from "lucia";
import { z } from "zod";
import type { musicIds } from "./schema/music";
import { cache } from "@solidjs/router";
import { db } from "./db";

export type MusicId = InferSelectModel<typeof musicIds> & {
	creator: Omit<User, "discordId" | "email" | "permissions">;
};

export const createIdSchema = z.object({
	id: z
		.string()
		.min(4, {
			message: "id has to be longer than 4 characters",
		})
		.max(24, {
			message: "id has to be shorter than 24 characters",
		}),
	name: z
		.string()
		.min(6, {
			message: "the name has to be longer than 6 characters",
		})
		.max(128, {
			message: "the name has to be shorter than 128 characters",
		}),
});

export const getMusicIds = cache(async () => {
	"use server";
	const ids = await db.query.musicIds.findMany({
		with: {
			creator: {
				columns: {
					profilePictureUrl: true,
					username: true,
					id: true,
				},
			},
		},
	});

	return ids;
}, "music_ids");
