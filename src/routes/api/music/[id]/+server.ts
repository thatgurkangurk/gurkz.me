import type { RequestHandler } from "./$types";
import { db } from "$lib/db/client";
import { musicIds } from "$lib/db/schema/music-id";
import { eq } from "drizzle-orm";

async function getMusicId(id: string) {
	const res = await db.select().from(musicIds).where(eq(musicIds.robloxId, id));

	return res[0];
}

export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;

	if (!id) {
		return new Response(
			JSON.stringify({
				message: "please provide an id"
			}),
			{
				status: 422
			}
		);
	}

	const res = await getMusicId(id);

	if (!res)
		return new Response(
			JSON.stringify({
				message: "not found"
			}),
			{
				status: 404
			}
		);

	return new Response(JSON.stringify(res), {
		status: 200
	});
};
