import { command, form, query } from "$app/server";
import { db } from "#lib/server/db/index.js";
import { video } from "#lib/server/db/schema/video.js";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import * as z from "zod/v4";

import { CreateNewVideoSchema, VideoMessageSchema } from "#lib/schemas/video.js";
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
			with: {
				creator: true
			}
		});

		return allClips;
	}
);

export const getClipsForVideo = query(
	z.object({
		videoId: z.string()
	}),
	async (params) => {
		adminOnlyGuard();

		const allClips = await db.query.clip.findMany({
			where: {
				videoId: params.videoId
			},
			orderBy: {
				createdAt: "asc"
			},
			with: {
				creator: true
			}
		});

		return allClips;
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
	}
);
