import { getMusicIds } from "./music";
import { getSession, signIn, signOut } from "./session";

export const router = {
  music: {
    get: getMusicIds,
  },
  session: {
    get: getSession,
    signIn: signIn,
    signOut: signOut,
  },
};
