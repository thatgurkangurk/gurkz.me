import { command, form } from "$app/server";
import * as env from "$app/env/private";
import { db } from "#lib/server/db/index.js";
import { clip } from "#lib/server/db/schema/clip.js";
import { EmbedBuilder } from "@discordjs/builders";
import { error, invalid } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import { ClipTitleSchema, CreateNewClipArgs, UpdateClipArgs } from "#lib/schemas/clip.js";
import { SongsSchema } from "#lib/schemas/song.js";
import { authGuard, ttcoreAdminOnlyGuard as adminOnlyGuard } from "./utils.js";
import { getClipsForVideo, getMyClipsForVideo } from "./videos.remote.js";
import * as z from "zod/v4";

type Video = {
	title: string;
	id: string;
	createdAt: Date;
	submissionsOpen: boolean;
};

function createClipSubmittedEmbed(
	clip: z.infer<typeof CreateNewClipArgs>,
	video: Video,
	authorName: string,
	overridden: { user: boolean; profile: boolean }
) {
	const embed = new EmbedBuilder();

	embed.setTitle(`new clip for ${video.title}`);
	embed.setDescription(clip.title);
	embed.addFields([
		{
			name: "author",
			value: authorName
		},
		{
			name: "overriden user",
			value: overridden.user ? "yes" : "no"
		},
		{
			name: "overriden profile",
			value: overridden.profile ? "yes" : "no"
		}
	]);

	embed.setTimestamp();
	embed.setColor(0x7289da);

	return embed;
}

export const createNewClip = form(CreateNewClipArgs, async (data) => {
	console.table(data);

	const { user } = authGuard();

	const queriedVideo = await db.query.video.findFirst({
		where: {
			id: data.videoId
		}
	});

	if (!queriedVideo?.submissionsOpen)
		invalid("sorry, but submissions are not open at the moment. check back later !");

	const isOverridingUserId = user.admin && data.userOverride != undefined;

	const createdById = isOverridingUserId ? data.userOverride : user.id;

	const isOverridingProfile = user.admin && data.profileOverride != undefined;

	if (!createdById) {
		throw new Error("createdById is null/undefined - this should never happen");
	}

	console.log("Overriding user id:", isOverridingUserId);
	console.log("createdById:", createdById);

	await db.insert(clip).values({
		createdById,
		url: data.url,
		videoId: data.videoId,
		title: data.title,
		overriddenProfileDataId: isOverridingProfile ? data.profileOverride : null,
		songs: data.songs,
		note: data.note
	});

	const embed = createClipSubmittedEmbed(data, queriedVideo, user.name, {
		profile: isOverridingProfile,
		user: isOverridingUserId
	});

	if (env.DISCORD_WEBHOOK_URL) {
		await fetch(env.DISCORD_WEBHOOK_URL, {
			method: "post",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				embeds: [embed.toJSON()]
			})
		});
	}
});

export const updateClip = form(UpdateClipArgs, async (data) => {
	const { user } = authGuard();

	console.log(data);

	const { clipId, title, note, songs } = data;

	console.log(songs);

	// if the user is an admin, only match the clipId.
	// otherwise, match both the clipId AND ensure they created it.
	const updateCondition = user.admin
		? eq(clip.id, clipId)
		: and(eq(clip.id, clipId), eq(clip.createdById, user.id));

	const [updatedClip] = await db
		.update(clip)
		.set({
			title,
			note: note ?? null,
			songs
		})
		.where(updateCondition)
		.returning();

	if (!updatedClip) {
		invalid("that clip was not found");
	}

	await getClipsForVideo({
		videoId: updatedClip.videoId
	}).refresh();

	await getMyClipsForVideo({
		videoId: updatedClip.videoId
	}).refresh();
});

export const deleteClip = command(
	z.object({
		clipId: z.string()
	}),
	async (data) => {
		adminOnlyGuard();

		const queriedClip = await db.query.clip.findFirst({
			where: {
				id: data.clipId
			}
		});

		if (!queriedClip)
			throw error(404, {
				message: "that clip was not found"
			});

		await db.delete(clip).where(eq(clip.id, data.clipId));

		await getClipsForVideo({
			videoId: queriedClip.videoId
		}).refresh();
	}
);

export const setNewClipSongs = command(
	z.object({
		clipId: z.string(),
		songs: SongsSchema
	}),
	async (data) => {
		const { user } = authGuard();

		const queriedClip = await db.query.clip.findFirst({
			where: {
				id: data.clipId,
				createdById: user.id
			}
		});

		if (!queriedClip)
			throw error(404, {
				message: "that clip was not found"
			});

		await db
			.update(clip)
			.set({
				songs: data.songs
			})
			.where(eq(clip.id, data.clipId));

		await getClipsForVideo({
			videoId: queriedClip.videoId
		}).refresh();
		await getMyClipsForVideo({
			videoId: queriedClip.videoId
		}).refresh();
	}
);

export const setNewClipTitle = command(
	z.object({
		clipId: z.string(),
		title: ClipTitleSchema
	}),
	async (data) => {
		const { user } = authGuard();

		const queriedClip = await db.query.clip.findFirst({
			where: {
				id: data.clipId,
				createdById: user.id
			}
		});

		if (!queriedClip)
			throw error(404, {
				message: "that clip was not found"
			});

		await db
			.update(clip)
			.set({
				title: data.title
			})
			.where(eq(clip.id, data.clipId));

		await getClipsForVideo({
			videoId: queriedClip.videoId
		}).refresh();
		await getMyClipsForVideo({
			videoId: queriedClip.videoId
		}).refresh();
	}
);

export const setClipSelected = command(
	z.object({
		clipId: z.string(),
		selected: z.boolean()
	}),
	async (data) => {
		adminOnlyGuard();

		const queriedClip = await db.query.clip.findFirst({
			where: {
				id: data.clipId
			}
		});

		if (!queriedClip)
			throw error(404, {
				message: "that clip was not found"
			});

		await db
			.update(clip)
			.set({
				selected: data.selected
			})
			.where(eq(clip.id, data.clipId));

		await getClipsForVideo({
			videoId: queriedClip.videoId
		}).refresh();
	}
);
