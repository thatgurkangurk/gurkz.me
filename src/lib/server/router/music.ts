import { MusicIdWithCreator } from "$lib/schemas/music";
import { or } from "../orpc";
import * as v from "valibot";

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
