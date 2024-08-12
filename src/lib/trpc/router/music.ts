import { z } from "zod";
import { procedure, protectedProcedure, router } from "../utils";
import { TRPCError } from "@trpc/server";
import { createIdSchema } from "~/lib/music";
import { withCursorPagination } from "drizzle-pagination";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/node";
import { env } from "~/env";
import { eq } from "drizzle-orm";

const numberSchema = z.number();

const createRatelimit = new Ratelimit({
	redis: new Redis({
		url: env.UPSTASH_REDIS_REST_URL,
		token: env.UPSTASH_REDIS_REST_TOKEN,
	}),
	limiter: Ratelimit.slidingWindow(10, "10 s"),
	prefix: "@upstash/ratelimit/music",
});

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

			if (process.env.NODE_ENV === "production") {
				const { success } = await createRatelimit.limit(user.id);

				if (!success) {
					throw new TRPCError({
						code: "TOO_MANY_REQUESTS",
						message: "slow down, you are being rate-limited",
					});
				}
			}

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

			return {
				message: "success",
			};
		}),
	deleteMusicId: protectedProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { user, db, musicIds } = ctx;
			const { id } = input;

			const musicId = await db.query.musicIds.findFirst({
				where: (musicId, { eq }) => eq(musicId.id, id),
			});

			if (!musicId)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "that music id doesn't exist",
				});

			if (
				!(
					musicId.createdById === user.id ||
					user.permissions.includes("MANAGE_MUSIC_IDS")
				)
			)
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "you do not have permission to do that.",
				});

			await db.delete(musicIds).where(eq(musicIds.id, id));

			return {
				message: "success",
			};
		}),
});
