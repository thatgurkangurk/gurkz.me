import { type User, type Session } from "$lib/auth.js";
import { createContext } from "svelte";

export const [useSession, setSession] = createContext<{
	data: {
		session: Session;
		user: User;
	} | null;
}>();
