import { type User, type Session } from "$lib/auth.js";
import { createContext } from "svelte";

// this class will be used for other things later
export class SessionState {
	current: {
		session: Session;
		user: User;
	} | null = $state(null);

	constructor(
		sessionData: {
			session: Session;
			user: User;
		} | null
	) {
		this.current = sessionData;
	}
}

export const [useSession, setSession] = createContext<SessionState>();
