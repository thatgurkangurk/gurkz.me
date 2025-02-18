import { db } from "$lib/server/db";
import { safeParse } from "valibot";
import { idFormatSchema, type IdFormat } from "./components/format.svelte.js";

export async function load({ parent, cookies }) {
	await parent();
	const musicIds = await db.query.musicIds.findMany({
		with: { creator: { columns: { id: true, name: true, image: true } } },
		where: (table, { eq }) => eq(table.verified, true),
		orderBy: (table, { desc }) => desc(table.created)
	});
	const idFormatCookie = cookies.get("id_format") ?? `"DEFAULT"`;
	const parseResult = safeParse(idFormatSchema, JSON.parse(idFormatCookie));

	const idFormat: IdFormat = parseResult.success ? parseResult.output : "DEFAULT";

	return { musicIds, idFormat };
}
