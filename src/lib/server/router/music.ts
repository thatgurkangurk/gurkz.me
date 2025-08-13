import { or } from "../orpc";
import { MusicIdWithCreator } from "$lib/schemas/music";

export const getMusicIds = or
	.route({ method: "GET" })
	.output(MusicIdWithCreator.array())
	.handler(async ({ context }) => {
		const ids = await context.db.query.musicIds.findMany({
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
