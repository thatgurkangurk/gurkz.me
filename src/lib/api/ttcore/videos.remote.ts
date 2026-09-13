import { CreateNewVideoSchema, VideoMessageSchema } from "#lib/schemas/video.js";
import { getOrGenerateClipThumbnail } from "#lib/server/clips/thumbnail.js";
import { db } from "#lib/server/db/index.js";
import { video } from "#lib/server/db/schema/video.js";

import { command, form, getRequestEvent, query } from "$app/server";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import * as z from "zod/v4";

import { ttcoreAdminOnlyGuard as adminOnlyGuard, authGuard } from "./utils";

export const createVideo = form(CreateNewVideoSchema, async (data) => {
	adminOnlyGuard();

	await db.insert(video).values({
		title: data.title,
		message: data.message,
		messageUpdatedAt: new Date()
	});

	await getVideos().refresh();
});

export const setVideoMessage = form(
	z.object({
		videoId: z.string(),
		newMessage: VideoMessageSchema
	}),
	async (data) => {
		adminOnlyGuard();

		await db
			.update(video)
			.set({
				message: data.newMessage,
				messageUpdatedAt: new Date()
			})
			.where(eq(video.id, data.videoId));

		await getVideos().refresh();
		await getVideoById({ videoId: data.videoId }).refresh();
	}
);

export const getVideos = query(async () => {
	const allVideos = await db.query.video.findMany({
		orderBy: {
			createdAt: "asc"
		}
	});
	return allVideos;
});

export const getVideosWithMySubmissions = query(async () => {
	const { user } = authGuard();

	const allVideos = await db.query.video.findMany({
		orderBy: {
			createdAt: "asc"
		},
		where: {
			clips: {
				createdById: user.id
			}
		}
	});
	return allVideos;
});

/**
 * very good name i know
 */
export const getDateOfLastSubmissionForVideoByCurrentUser = query(z.string(), async (data) => {
	const { user } = authGuard();

	const lastSubmittedClip = await db.query.clip.findFirst({
		orderBy: {
			createdAt: "desc"
		},
		where: {
			createdById: user.id,
			videoId: data
		}
	});

	return lastSubmittedClip?.createdAt || null;
});

export const getVideoById = query(
	z.object({
		videoId: z.string()
	}),
	async (data) => {
		authGuard();
		const queriedVideo = await db.query.video.findFirst({
			where: {
				id: data.videoId
			}
		});

		if (!queriedVideo) error(404);

		return queriedVideo;
	}
);

export const getMyClipsForVideo = query(
	z.object({
		videoId: z.string()
	}),
	async (params) => {
		const { user } = authGuard();

		const allClips = await db.query.clip.findMany({
			where: {
				videoId: params.videoId,
				createdById: user.id
			},
			orderBy: {
				createdAt: "asc"
			},
			columns: {
				thumbnail: false
			},
			with: {
				creator: true
			}
		});

		return allClips;
	}
);

export const getClipsForVideo = query(
	z.object({
		videoId: z.string(),
		page: z.number().int().positive().default(1),
		limit: z.number().int().min(1).max(100).default(20),
		search: z.string().default("")
	}),
	async ({ videoId, page = 1, limit = 20, search = "" }) => {
		adminOnlyGuard();

		const offset = (page - 1) * limit;

		const res = await db.query.clip.findMany({
			where: {
				videoId,
				...(search && {
					title: { ilike: `%${search}%` }
				})
			},
			columns: {
				thumbnail: false
			},
			with: {
				creator: true
			},
			orderBy: ({ createdAt }, { asc }) => asc(createdAt),
			limit,
			offset
		});

		return res;
	}
);

const videoStatusListeners = new Map<string, Set<() => void>>();

function notifyVideoStatusChange(videoId: string) {
	const listeners = videoStatusListeners.get(videoId);
	if (listeners) {
		listeners.forEach((resolve) => resolve());
		listeners.clear();
	}
}

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

export const getVideoStatus = query.live(
	z.object({
		videoId: z.string()
	}),
	async function* (data) {
		try {
			while (true) {
				const queriedVideo = await db.query.video.findFirst({
					where: {
						id: data.videoId
					}
				});

				if (!queriedVideo) error(404);

				if (queriedVideo.submissionsOpen) {
					const event = getRequestEvent();

					if (!event.locals.user) error(401, "please sign in to continue");

					yield {
						...queriedVideo,
						submitters: []
					};
				} else {
					const submitters = await getSubmittersForVideo(queriedVideo.id);

					yield {
						...queriedVideo,
						submitters: submitters
					};
				}

				const { promise, resolve } = Promise.withResolvers<void>();

				if (!videoStatusListeners.has(data.videoId)) {
					videoStatusListeners.set(data.videoId, new Set());
				}
				const listeners = videoStatusListeners.get(data.videoId)!;
				listeners.add(resolve);

				await promise;
			}
		} finally {
			const listeners = videoStatusListeners.get(data.videoId);
			if (listeners) {
				listeners.clear();
				videoStatusListeners.delete(data.videoId);
			}
		}
	}
);

export const getSubmissionsOpen = query(
	z.object({
		videoId: z.string()
	}),
	async (data) => {
		adminOnlyGuard();
		const queriedVideo = await db.query.video.findFirst({
			where: {
				id: data.videoId
			}
		});

		if (!queriedVideo) error(404);

		return queriedVideo.submissionsOpen;
	}
);

export const setSubmissionsOpen = command(
	z.object({
		videoId: z.string(),
		submissionsOpen: z.boolean()
	}),
	async (data) => {
		adminOnlyGuard();
		await db
			.update(video)
			.set({
				submissionsOpen: data.submissionsOpen
			})
			.where(eq(video.id, data.videoId));

		await getSubmissionsOpen({
			videoId: data.videoId
		}).refresh();
		await getVideoById({
			videoId: data.videoId
		}).refresh();
		await getVideos().refresh();

		notifyVideoStatusChange(data.videoId);
	}
);
