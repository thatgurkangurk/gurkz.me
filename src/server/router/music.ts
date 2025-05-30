import { eq } from "drizzle-orm";
import { pub } from "../orpc";
import { musicIds } from "../schema/music-id";
import { type } from "arktype";
import { withCursorPagination } from "drizzle-pagination";
import { z } from "zod/v4";
import { MusicId } from "~/lib/schema/music";

export const getMusicIds = pub
	.route({
		method: "GET",
		path: "/music-ids",
		summary: "get music ids",
		tags: ["music-id"]
	})
	.input(
		type({
			limit: type.keywords.number.integer.atLeast(1).atMost(50).default(10),
			cursor: "string | null | undefined",
			verifiedOnly: type.keywords.boolean.default(true)
		})
	)
	.output(
		z.object({
			nextCursor: z.string().nullish(),
			data: z.array(MusicId)
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
