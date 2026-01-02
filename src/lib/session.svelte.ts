import { invalidateAll } from "$app/navigation";
import { page } from "$app/state";
import { type User, type Session, authClient } from "$lib/auth.js";
import type { SocialProvider } from "better-auth";
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

	async signOut() {
		const res = await authClient.signOut();
		await invalidateAll();
		return res;
	}

	async signInSocial(provider: SocialProvider) {
		return await authClient.signIn.social({
			provider: provider,
			callbackURL: page.route.id?.toString()
		});
	}
}

export const [useSession, setSession] = createContext<SessionState>();
