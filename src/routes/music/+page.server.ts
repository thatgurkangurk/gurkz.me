import { db } from "$lib/server/db";

export async function load({ parent }) {
	await parent();
	const musicIds = await db.query.musicIds.findMany({
		with: { creator: { columns: { id: true, name: true, image: true } } },
		where: (table, { eq }) => eq(table.verified, true),
		orderBy: (table, { desc }) => desc(table.created)
	});

	return { musicIds };
}
