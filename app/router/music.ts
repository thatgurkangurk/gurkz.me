import { eq } from "drizzle-orm";
import { pub } from "../server/orpc";
import { musicIds } from "../server/schema/music-id";
import { type } from "arktype";
import { withCursorPagination } from "drizzle-pagination";
import { db } from "../server/db";

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
		type({
			nextCursor: "string | null | undefined",
			data: type({
				id: "string",
				name: "string",
				robloxId: "string",
				createdById: "string",
				created: "Date",
				working: "boolean",
				verified: "boolean",
				tags: "string[]",
				creator: type({
					id: "string",
					name: "string",
					image: "string | null"
				})
			}).array()
		})
	)
	.handler(async ({ input }) => {
		const { cursor } = input;

		const results = await db.query.musicIds.findMany({
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
