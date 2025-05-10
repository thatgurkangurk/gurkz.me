import { getSession } from "./auth";
import { createMusicId, getMusicIds } from "./music";

export const router = {
	music: {
		getMusicIds,
		createMusicId
	},
	auth: {
		getSession
	}
};
