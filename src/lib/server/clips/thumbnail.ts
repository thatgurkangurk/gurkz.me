import { db } from "#lib/server/db/index.js";
import { clip as clips } from "#lib/server/db/schema.js";
import type { Clip } from "#lib/types/clip.js";

import { type ExecException, execFile } from "child_process";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import ffmpegPath from "ffmpeg-static";
import { promises as fs } from "fs";
import { ResultAsync, errAsync } from "neverthrow";
import os from "os";
import path from "path";
import sharp from "sharp";

export function getOrGenerateClipThumbnail(clipInput: string | Clip): ResultAsync<Buffer, Error> {
	return ResultAsync.fromPromise(
		resolveClip(clipInput),
		(err) => new Error(`Failed to resolve clip: ${(err as Error).message}`)
	).andThen((clip) => {
		if (clip.thumbnail) {
			return ResultAsync.fromSafePromise(Promise.resolve(Buffer.from(clip.thumbnail)));
		}

		return extractFrameNative(clip.url)
			.andThen((rawFrame) =>
				ResultAsync.fromPromise(
					sharp(rawFrame).resize(320).webp({ quality: 35, effort: 6 }).toBuffer(),
					(err) => new Error(`Sharp compression failed: ${(err as Error).message}`)
				)
			)
			.andThen((compressedBuffer) =>
				ResultAsync.fromPromise(
					db
						.update(clips)
						.set({ thumbnail: compressedBuffer })
						.where(eq(clips.id, clip.id))
						.then(() => compressedBuffer),
					(err) => new Error(`Database save failed: ${(err as Error).message}`)
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
		throw new Error(`Clip with ID "${clipInput}" not found`);
	}

	return foundClip;
}

function extractFrameNative(videoUrl: string): ResultAsync<Buffer, Error> {
	if (!ffmpegPath) {
		return errAsync(new Error("FFmpeg static binary path not found"));
	}

	const executablePath: string = ffmpegPath;

	return ResultAsync.fromPromise(
		fetch(videoUrl).then((res) => {
			if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
			return res.arrayBuffer();
		}),
		(err) => new Error(`Failed to fetch video stream: ${(err as Error).message}`)
	).andThen((arrayBuffer) => {
		const tempFileName = `clip-${crypto.randomUUID()}.mp4`;
		const tempFilePath = path.join(os.tmpdir(), tempFileName);
		const videoBuffer = Buffer.from(arrayBuffer);

		return ResultAsync.fromPromise(
			fs.writeFile(tempFilePath, videoBuffer),
			(err) => new Error(`Failed to write temp file: ${(err as Error).message}`)
		).andThen(() =>
			runFFmpegExec(executablePath, tempFilePath).andThen((frameBuffer) =>
				ResultAsync.fromPromise(fs.unlink(tempFilePath), () => new Error("Cleanup failed"))
					.map(() => frameBuffer)
					.orElse(() => ResultAsync.fromSafePromise(Promise.resolve(frameBuffer)))
			)
		);
	});
}

function runFFmpegExec(executablePath: string, inputPath: string): ResultAsync<Buffer, Error> {
	return ResultAsync.fromPromise(
		new Promise<Buffer>((resolve, reject) => {
			const args = [
				"-ss",
				"00:00:00.100",
				"-i",
				inputPath,
				"-vframes",
				"1",
				"-f",
				"image2pipe",
				"-vcodec",
				"png",
				"pipe:1"
			];

			execFile(
				executablePath,
				args,
				{ encoding: "buffer", maxBuffer: 10 * 1024 * 1024 },
				(err: ExecException | null, stdout: Buffer, stderr: Buffer) => {
					if (err) {
						console.error("FFmpeg Stderr Output:", stderr.toString());
						return reject(err);
					}
					resolve(stdout);
				}
			);
		}),
		(err) => new Error(`FFmpeg process failed: ${(err as Error).message}`)
	);
}
