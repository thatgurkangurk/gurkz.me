import {
  createMusicId,
  deleteMusicId,
  editMusicId,
  getMusicIds,
} from "./music";
import { getSession, signIn, signOut } from "./session";

export const router = {
  music: {
    get: getMusicIds,
    create: createMusicId,
    delete: deleteMusicId,
    update: editMusicId,
  },
  session: {
    get: getSession,
    signIn: signIn,
    signOut: signOut,
  },
};
