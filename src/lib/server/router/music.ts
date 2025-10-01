import { hasPermission } from "$lib/permissions";
import { MusicIdWithCreator } from "$lib/schemas/music";
import { ORPCError } from "@orpc/server";
import { CreateMusicIdSchema } from "../../../routes/music/forms";
import { requireAuthMiddleware } from "../middleware/auth";
import { or } from "../orpc";
import * as v from "valibot";
import { musicIds } from "../db/schema/music";

export const getMusicIds = or
	.route({ method: "GET" })
	.output(v.array(MusicIdWithCreator))
	.handler(async ({ context: { db } }) => {
		const ids = await db.query.musicIds.findMany({
			columns: {
				id: true,
				name: true,
				robloxId: true,
				createdById: true,
				created: true,
				working: true,
				verified: true,
				tags: true
			},
			with: {
				creator: {
					columns: {
						id: true,
						name: true,
						image: true
					}
				}
			},
			orderBy: ({ id }, { desc }) => desc(id)
		});

		return ids;
	});

export const createMusicId = or
	.input(CreateMusicIdSchema)
	.use(requireAuthMiddleware)
	.handler(async ({ context, input }) => {
		const { user } = context.session;
		if (!hasPermission(user, "CREATE_MUSIC_IDS")) throw new ORPCError("FORBIDDEN");

		await context.db
			.insert(musicIds)
			.values({
				verified: hasPermission(user, "CREATE_AUTO_VERIFIED_MUSIC_IDS") ? true : false,
				createdById: user.id,
				name: input.name,
				robloxId: input.robloxId,
				tags: input.tags
			})
			.catch((err) => {
				console.error(err);
				throw new ORPCError("INTERNAL_SERVER_ERROR", {
					message: "could not create the music id"
				});
			});

		return {
			text: "successfully created the music id",
			type: "success"
		};
	});
