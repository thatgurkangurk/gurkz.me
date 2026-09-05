import * as z from "zod/v4";
import { SongsSchema } from "./song.js";

export const ClipTitleSchema = z
	.string({
		error: (issue) =>
			issue.input === undefined ? "please provide a title" : "please provide a title"
	})
	.min(4, { error: "please provide a title longer than 4 characters" })
	.max(48, { error: "please provide a title shorter than 48 characters" });

export const ClipUrlSchema = z
	.url({ error: "please provide a valid url" })
	.refine(
		(value) => {
			try {
				const parsed = new URL(value);
				return parsed.hostname !== "cdn.discordapp.com";
			} catch {
				return false;
			}
		},
		{ error: "please do not use discord cdn links" }
	)
	.regex(/\.(mp4|webm|mov|mkv|avi)$/i, { error: "url must be a valid video" });

export const ClipNoteSchema = z
	.string()
	.min(4, { error: "please provide a note longer than 4 characters" })
	.max(1024, { error: "please provide a note shorter than 1024 characters" });

export const CreateNewClipSchema = z.object({
	title: ClipTitleSchema,

	profileOverride: z.union([z.literal("").transform(() => undefined), z.uuid()]).optional(),

	userOverride: z.union([z.literal("").transform(() => undefined), z.string().min(1)]).optional(),

	url: ClipUrlSchema,

	note: z
		.union([ClipNoteSchema, z.literal("")])
		.transform((val) => (val === "" ? undefined : val))
		.optional(),

	songs: SongsSchema.optional().default([])
});

export const CreateNewClipArgs = CreateNewClipSchema.extend({
	videoId: z.ulid()
});

export const UpdateClipArgs = z.object({
	clipId: z.string(),

	title: ClipTitleSchema.optional(),

	note: z
		.union([ClipNoteSchema, z.literal("")])
		.transform((val) => (val === "" ? undefined : val))
		.optional(),

	songs: SongsSchema.optional().default([])
});
