import { db } from "#lib/server/db/index.js";
import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";
import { defineMeta } from "#lib/meta.js";

async function getSubmittersForVideo(videoId: string) {
	const res = await db.query.clip.findMany({
		where: {
			videoId: videoId
		},
		columns: {
			createdAt: false,
			createdById: false,
			id: false,
			selected: false,
			title: false,
			url: false,
			videoId: false
		},
		with: {
			creator: {
				columns: {
					id: true,
					name: true,
					username: true
				}
			},
			overriddenProfileData: true
		}
	});

	const unique = new Map<
		string,
		{ id: string; line1: string; line2: string; isOverridden?: boolean }
	>();

	for (const row of res) {
		if (row.overriddenProfileData) {
			unique.set(row.overriddenProfileData.id, {
				id: row.overriddenProfileData.id,
				line1: row.overriddenProfileData.line1,
				line2: row.overriddenProfileData.line2,
				isOverridden: true
			});

			continue;
		}

		if (row.creator) {
			unique.set(row.creator.id, {
				id: row.creator.id,
				line1: row.creator.name,
				line2: `@${row.creator.username}`
			});
		}
	}
	return [...unique.values()];
}

export const load = (async (ev) => {
	const queriedVideo = await db.query.video.findFirst({
		where: {
			id: ev.params.videoId
		}
	});

	if (!queriedVideo) throw error(404);

	if (queriedVideo.submissionsOpen && !ev.locals.user)
		throw error(401, {
			message: "please sign in to continue"
		});

	const submitters = queriedVideo.submissionsOpen
		? []
		: await getSubmittersForVideo(queriedVideo.id);

	return {
		submissionsOpen: queriedVideo.submissionsOpen,
		submitters,
		details: queriedVideo,
		meta: defineMeta({
			title: `submit to ${queriedVideo.title}`
		})
	};
}) satisfies PageServerLoad;
