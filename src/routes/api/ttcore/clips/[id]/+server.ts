import { gurkanOnlyApiKeyGuard } from "#lib/api/server-utils.server.js";
import { db } from "#lib/server/db/index.js";

import { error } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (ev) => {
	await gurkanOnlyApiKeyGuard(ev.request.headers.get("x-api-key") || "");

	const clip = await db.query.clip.findFirst({
		where: {
			id: ev.params.id
		},
		orderBy: {
			createdAt: "asc"
		},
		with: {
			creator: true,
			overriddenProfileData: true
		}
	});

	if (!clip) return error(404);

	return Response.json({
		clip: clip
	});
};
