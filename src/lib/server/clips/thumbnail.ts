import { db } from "#lib/server/db/index.js";
import { clip as clips } from "#lib/server/db/schema.js";
import type { Clip } from "#lib/types/clip.js";

import { THUMBNAIL_TOKEN } from "$app/env/private";
import { eq } from "drizzle-orm";
import { ResultAsync } from "neverthrow";

export function getOrGenerateClipThumbnail(clipInput: string | Clip): ResultAsync<Buffer, Error> {
	return ResultAsync.fromPromise(
		resolveClip(clipInput),
		(err) => new Error(`failed to resolve clip: ${(err as Error).message}`)
	).andThen((clip) => {
		if (clip.thumbnail) {
			return ResultAsync.fromSafePromise(Promise.resolve(Buffer.from(clip.thumbnail)));
		}

		return fetchThumbnailApi(clip.url).andThen((compressedBuffer) =>
			ResultAsync.fromPromise(
				db
					.update(clips)
					.set({ thumbnail: compressedBuffer })
					.where(eq(clips.id, clip.id))
					.then(() => compressedBuffer),
				(err) => new Error(`db save failed: ${(err as Error).message}`)
			)
		);
	});
}

async function resolveClip(
	clipInput: string | Clip
): Promise<{ id: string; url: string; thumbnail?: Buffer | Uint8Array | null }> {
	if (typeof clipInput !== "string") {
		return clipInput;
	}

	const [foundClip] = await db
		.select({
			id: clips.id,
			url: clips.url,
			thumbnail: clips.thumbnail
		})
		.from(clips)
		.where(eq(clips.id, clipInput))
		.limit(1);

	if (!foundClip) {
		throw new Error(`clip with id "${clipInput}" not found`);
	}

	return foundClip;
}

function fetchThumbnailApi(videoUrl: string): ResultAsync<Buffer, Error> {
	const apiUrl = `https://thumbnail.gurkz.me/api/thumbnail?videoUrl=${encodeURIComponent(videoUrl)}`;

	return ResultAsync.fromPromise(
		fetch(apiUrl, {
			headers: {
				Authorization: `Bearer ${THUMBNAIL_TOKEN}`
			}
		}).then(async (res) => {
			if (!res.ok) {
				throw new Error(`HTTP ${res.status}: ${res.statusText}`);
			}
			const arrayBuffer = await res.arrayBuffer();
			return Buffer.from(arrayBuffer);
		}),
		(err) => new Error(`failed to generate a thumbnail: ${(err as Error).message}`)
	);
}
