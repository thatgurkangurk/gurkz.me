import { z } from "zod";
import { pub } from "../orpc";
import { eq } from "drizzle-orm";
import { musicIds } from "$lib/server/schema/music-id";
import { withCursorPagination } from "drizzle-pagination";

export const getMusicIds = pub
	.route({
		method: "GET",
		path: "/music-ids",
		summary: "get music ids",
		tags: ["music-id"]
	})
	.input(
		z.object({
			limit: z.number().int().min(1).max(50).default(10),
			cursor: z.string().nullish(),
			verifiedOnly: z.boolean().default(true)
		})
	)
	.output(
		z.object({
			nextCursor: z.string().nullable().describe("null if no more pages exist"),
			data: z.array(
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
		})
	)
	.handler(async ({ context, input }) => {
		const { cursor } = input;

		const results = await context.db.query.musicIds.findMany({
			...withCursorPagination({
				where: input.verifiedOnly ? eq(musicIds.verified, true) : undefined,
				limit: input.limit,
				cursors: [[musicIds.id, "desc", cursor ? cursor : undefined]]
			}),
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
			}
		});

		return {
			data: results,
			nextCursor: results.length ? results[results.length - 1].id : null
		};
	});
