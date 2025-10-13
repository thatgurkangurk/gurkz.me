import { createMusicId, deleteMusicId, editMusicId, getMusicId, listMusicIds } from "./music";
import { getSession, signIn, signOut } from "./session";

export const router = {
	session: {
		get: getSession,
		signIn: signIn,
		signOut: signOut
	},
	music: {
		get: getMusicId,
		list: listMusicIds,
		create: createMusicId,
		edit: editMusicId,
		delete: deleteMusicId
	}
};
