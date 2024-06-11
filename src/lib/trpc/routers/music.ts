import { z } from "zod";
import { t } from "../t";
import { withCursorPagination } from "drizzle-pagination";
import { db } from "$lib/db";
import { musicIds } from "$lib/schema/music";
import { TRPCError } from "@trpc/server";
import type { User } from "$lib/user/types";
import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from "obscenity";
import { createMusicId, deleteMusicId } from "$lib/music-id";
import { createMusicIdSchema } from "../../../routes/music/validation";
import type { MusicId } from "$lib/music-id/type";

const matcher = new RegExpMatcher({
	...englishDataset.build(),
	...englishRecommendedTransformers
});

const numberSchema = z.number();

export const musicRouter = t.router({
	getInfiniteIds: t.procedure
		.input(
			z.object({
				cursor: z.string().nullish(),
				limit: z.number().min(1).max(30).default(15)
			})
		)
		.query(async ({ input }) => {
			const { cursor, limit } = input;

			const data = await db.query.musicIds.findMany(
				withCursorPagination({
					limit,
					cursors: [[musicIds.created, "desc", cursor ? new Date(cursor) : undefined]]
				})
			);

			return {
				data,
				nextCursor: data.length ? data[data.length - 1].created?.toISOString() : null
			};
		}),
	getMusicId: t.procedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.query(async ({ input }) => {
			const { id } = input;

			const musicId = await db.query.musicIds.findFirst({
				where: (m, { eq }) => eq(m.id, id)
			});

			if (!musicId)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "not found"
				});

			const owner = (await (
				await fetch(`https://passport.gurkz.me/api/user/get/${musicId.createdById}`)
			).json()) as unknown as User;

			if (!owner) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "owner was not found"
				});
			}

			return {
				owner: owner,
				...musicId
			};
		}),
	createMusicId: t.procedure.input(createMusicIdSchema).mutation(async ({ ctx, input }) => {
		const { id, name } = input;
		const { user } = ctx.locals;

		if (!user || !user.permissions["canCreateMusicIds"]) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "you are not allowed to create a music id."
			});
		}

		const number = numberSchema.safeParse(Number(id));

		if (!number.success) {
			throw new TRPCError({
				code: "UNPROCESSABLE_CONTENT",
				message: "you need to provide a number as the ID"
			});
		}

		await createMusicId(
			{
				name: name,
				robloxId: number.data,
				createdById: user.id
			},
			user
		).catch(() => {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "something unexpected went wrong"
			});
		});
	}),
	deleteMusicId: t.procedure
		.input(
			z.object({
				id: z.string().length(21, {
					message: "not a valid id"
				})
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { user } = ctx.locals;
			const { id } = input;

			if (!user)
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "you are not logged in"
				});

			const musicId = await db.query.musicIds.findFirst({
				where: (m, { eq }) => eq(m.id, id)
			});

			if (!musicId) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "that music ID doesn't exist. (do not try to delete using the roblox id)"
				});
			}

			if (!(user.id === musicId.createdById) || !user.permissions["canManageMusicIds"]) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "you do not have permission to delete that."
				});
			}

			await deleteMusicId(id, user).catch(() => {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "something unexpected went wrong"
				});
			});
		})
});
