import { createPermix } from "#lib/permix.js";
import { db } from "#lib/server/db/index.js";
import { error } from "@sveltejs/kit";
import { getSessionFromApiKey } from "#lib/server/api-helpers.js";
import { count, ilike } from "drizzle-orm";
import { musicIds as musicIdsTable } from "#lib/server/db/schema.js";
import { z } from "zod";

const querySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().min(1).max(100).default(20),
	search: z.string().default("")
});

export async function GET({ request, url }) {
	const authResult = await getSessionFromApiKey(request);

	if (authResult.isErr()) {
		const authErr = authResult.error;

		switch (authErr.type) {
			case "UNAUTHORIZED":
				throw error(401, authErr.message);
			case "RATE_LIMITED":
				throw error(429, authErr.message);
			case "INTERNAL_SERVER_ERROR":
				throw error(500, authErr.message);
			default:
				throw error(500, "internal server error");
		}
	}

	const { user } = authResult.value;
	const permix = createPermix(user);

	if (!permix.check("musicId.list")) {
		throw error(403, "you do not have permission to do this");
	}

	const rawParams = Object.fromEntries(url.searchParams);
	const parsed = querySchema.safeParse(rawParams);

	if (!parsed.success) {
		throw error(400, "invalid query parameters");
	}

	const { page, limit, search } = parsed.data;
	const offset = (page - 1) * limit;

	const whereClause = search ? ilike(musicIdsTable.name, `%${search}%`) : undefined;

	const [totalResult, musicIds] = await Promise.all([
		db.select({ count: count() }).from(musicIdsTable).where(whereClause),
		db.query.musicIds.findMany({
			...(search && {
				where: { name: { ilike: `%${search}%` } }
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
			limit,
			offset
		})
	]);

	const totalItems = totalResult[0]?.count ?? 0;
	const totalPages = Math.ceil(totalItems / limit);

	return Response.json({
		data: musicIds,
		pagination: {
			page,
			limit,
			totalItems,
			totalPages,
			hasNextPage: page < totalPages,
			hasPrevPage: page > 1
		}
	});
}
