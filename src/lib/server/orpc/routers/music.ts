import { createMusicIdSchema } from "#lib/features/music/schemas.js";
import { musicIds } from "#lib/server/db/schema.js";

import { ORPCError } from "@orpc/client";
import { openapi } from "@orpc/openapi";
import { count, eq, ilike } from "drizzle-orm";
import * as z from "zod/v4";

import { base, orpcPermix } from "..";

export const FetchMusicIdsArgs = z.compile(
	z.object({
		page: z.number().int().positive().default(1),
		limit: z.number().int().min(1).max(100).default(20),
		search: z.string().default("")
	})
);

export const DeleteMusicIdArgs = z.compile(
	z.object({
		id: z.ulid()
	})
);

export const listMusicIds = base
	.meta(
		openapi({
			method: "GET",
			path: "/music",
			spec: { security: [{ apiKey: [] }] }
		})
	)
	.input(FetchMusicIdsArgs)
	.use(orpcPermix.checkMiddleware("musicId.list"))
	.handler(async ({ input, context }) => {
		const offset = (input.page - 1) * input.limit;

		const whereClause = input.search ? ilike(musicIds.name, `%${input.search}%`) : undefined;

		const [totalResult, musicIdsResult] = await Promise.all([
			context.db.select({ count: count() }).from(musicIds).where(whereClause),
			context.db.query.musicIds.findMany({
				...(input.search && {
					where: { name: { ilike: `%${input.search}%` } }
				}),
				columns: {
					id: true,
					name: true,
					robloxId: true,
					createdById: true,
					createdAt: true,
					working: true,
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
				orderBy: ({ id }, { desc }) => desc(id),
				limit: input.limit,
				offset
			})
		]);

		const totalItems = totalResult[0]?.count ?? 0;
		const totalPages = Math.ceil(totalItems / input.limit);

		return {
			data: musicIdsResult,
			pagination: {
				page: input.page,
				limit: input.limit,
				totalItems,
				totalPages,
				hasNextPage: input.page < totalPages,
				hasPrevPage: input.page > 1
			}
		};
	});

export const deleteMusicId = base
	.meta(
		openapi({
			method: "DELETE",
			path: "/music/{id}",
			spec: { security: [{ apiKey: [] }] }
		})
	)
	.input(DeleteMusicIdArgs)
	.handler(async ({ input, context }) => {
		if (!context.session) throw new ORPCError("UNAUTHORIZED");

		const musicIdToDelete = (
			await context.db.select().from(musicIds).where(eq(musicIds.id, input.id)).limit(1)
		)[0];

		if (!musicIdToDelete) throw new ORPCError("NOT_FOUND");

		if (!context.permix.check("musicId.delete", musicIdToDelete)) throw new ORPCError("FORBIDDEN");

		try {
			await context.db.delete(musicIds).where(eq(musicIds.id, musicIdToDelete.id));
		} catch (err) {
			console.error("failed to delete music id", err);
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to delete music id"
			});
		}

		return {
			success: true
		};
	});

export const createMusicId = base
	.meta(
		openapi({
			method: "POST",
			path: "/music",
			spec: { security: [{ apiKey: [] }] }
		})
	)
	.use(orpcPermix.checkMiddleware("musicId.create"))
	.input(z.compile(createMusicIdSchema))
	.handler(async ({ input, context }) => {
		if (!context.session) throw new ORPCError("UNAUTHORIZED");

		try {
			await context.db.insert(musicIds).values({
				createdById: context.session.user.id,
				name: input.name,
				tags: input.tags,
				robloxId: input.robloxId
			});
		} catch (err) {
			console.error("creating music id failed", err);
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to create music id"
			});
		}

		return {
			success: true
		};
	});

export const musicRouter = {
	list: listMusicIds,
	create: createMusicId,
	delete: deleteMusicId
};
