import { z } from "zod";
import { procedure, protectedProcedure, router } from "../utils";
import { TRPCError } from "@trpc/server";
import { createIdSchema } from "~/lib/music";
import { withCursorPagination } from "drizzle-pagination";

const numberSchema = z.number();

export default router({
	getMusicIds: procedure.query(async ({ ctx }) => {
		const { db } = ctx;
		const music = await db.query.musicIds.findMany({
			with: {
				creator: true,
			},
		});

		return {
			data: music,
		};
	}),
	getInfiniteMusicIds: procedure
		.input(
			z.object({
				cursor: z.string().nullish(),
				limit: z.number().min(1).max(30).default(15),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { cursor, limit } = input;
			const { db, musicIds } = ctx;
			const data = await db.query.musicIds.findMany({
				...withCursorPagination({
					limit,
					cursors: [
						[musicIds.created, "desc", cursor ? new Date(cursor) : undefined],
					],
				}),
				with: {
					creator: true,
				},
			});

			return {
				data,
				nextCursor: data.length
					? data[data.length - 1].created?.toISOString()
					: null,
			};
		}),
	createMusicId: protectedProcedure
		.input(createIdSchema)
		.mutation(async ({ ctx, input }) => {
			const { user, db, musicIds } = ctx;
			const { id, name } = input;

			if (!user.permissions.includes("CREATE_MUSIC_IDS"))
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "you do not have permission to do that",
				});

			const number = await numberSchema.safeParseAsync(Number(id));

			if (!number.success)
				throw new TRPCError({
					code: "UNPROCESSABLE_CONTENT",
					message: "you need to provide a number as the id",
				});

			await db
				.insert(musicIds)
				.values({
					robloxId: number.data,
					name: name,
					createdById: user.id,
					working: true,
				})
				.catch((err) => {
					console.error(err);
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "something went wrong",
					});
				});
		}),
});
