import { z } from "zod";
import { pub } from "../orpc";
import { eq, desc } from "drizzle-orm";
import { musicIds } from "$lib/server/schema/music-id";
import { users } from "$lib/server/schema/user";

export const getMusicIds = pub
	.route({
		method: "GET",
		path: "/music-ids",
		summary: "get music ids",
		tags: ["music-id"]
	})
	.input(
		z.object({
			verifiedOnly: z.boolean().default(true)
		})
	)
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
	.handler(async ({ context, input }) => {
		const baseQuery = context.db
			.select({
				id: musicIds.id,
				name: musicIds.name,
				robloxId: musicIds.robloxId,
				createdById: musicIds.createdById,
				created: musicIds.created,
				working: musicIds.working,
				verified: musicIds.verified,
				tags: musicIds.tags,
				creator: {
					id: users.id,
					name: users.name,
					image: users.image
				}
			})
			.from(musicIds)
			.innerJoin(users, eq(musicIds.createdById, users.id))
			.orderBy(desc(musicIds.created));

		const results = input.verifiedOnly ? baseQuery.where(eq(musicIds.verified, true)) : baseQuery;

		return results;
	});
