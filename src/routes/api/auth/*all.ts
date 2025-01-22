import { toSolidStartHandler } from "better-auth/solid-start";
import { auth } from "~/server/auth";

export const { GET, POST } = toSolidStartHandler(auth);
