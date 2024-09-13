import { z } from "zod";

type MusicId = {
	id: string;
	name: string;
	robloxId: number;
	created: Date;
	working: boolean;
	creator: Creator;
};

type Creator = {
	username: string;
	profilePictureUrl?: string;
};

const createMusicIdSchema = z.object({
	id: z
		.string()
		.min(4, {
			message: "id has to be longer than 4 characters",
		})
		.max(24, {
			message: "id has to be shorter than 24 characters",
		})
		.refine((arg) => parseInt(arg), {
			message: "you have to provide a number",
		}),
	name: z
		.string()
		.min(6, {
			message: "the name has to be longer than 6 characters",
		})
		.max(128, {
			message: "the name has to be shorter than 128 characters",
		}),
});

export { createMusicIdSchema };
export type { MusicId };
