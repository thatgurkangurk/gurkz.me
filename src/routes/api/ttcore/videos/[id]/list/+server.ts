import { gurkanOnlyApiKeyGuard } from "#lib/api/server-utils.server.js";
import { db } from "#lib/server/db/index.js";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (ev) => {
	await gurkanOnlyApiKeyGuard(ev.request.headers.get("x-api-key") || "");

	const allClips = await db.query.clip.findMany({
		where: {
			videoId: ev.params.id
		},
		orderBy: {
			createdAt: "asc"
		},
		with: {
			creator: true,
			overriddenProfileData: true
		}
	});

	return Response.json({
		clips: allClips
	});
};
