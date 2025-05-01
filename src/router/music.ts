import { z } from "zod";
import { pub } from "../orpc";

export const getMusicIds = pub
	.route({
		method: "GET",
		path: "/music-ids",
		summary: "get music ids",
		tags: ["music-id"]
	})
	.output(
		z.array(
			z.object({
				id: z.string(),
				name: z.string(),
				robloxId: z.string(),
				createdById: z.string(),
				created: z.date(),
				working: z.boolean(),
				verified: z.boolean(),
				tags: z.array(z.string()),
				creator: z.object({
					id: z.string(),
					name: z.string(),
					image: z.string().nullable()
				})
			})
		)
	)
	.handler(async ({ context }) => {
		const musicIds = await context.db.query.musicIds.findMany({
			with: { creator: { columns: { id: true, name: true, image: true } } },
			where: (table, { eq }) => eq(table.verified, true),
			orderBy: (table, { desc }) => desc(table.created)
		});

		return musicIds;
	});
