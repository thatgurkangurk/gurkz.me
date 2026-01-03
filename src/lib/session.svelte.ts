import { invalidateAll } from "$app/navigation";
import { page } from "$app/state";
import { type User, type Session } from "$lib/auth.js";
import type { SocialProvider } from "better-auth";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/svelte";
import { createContext } from "svelte";
import type { auth } from "./server/auth";
import { fromStore } from "svelte/store";

export class SessionState {
	current: {
		session: Session;
		user: User;
	} | null = $state(null);
	public readonly authClient;

	constructor(
		sessionData: {
			session: Session;
			user: User;
		} | null
	) {
		this.current = sessionData;
		this.authClient = createAuthClient({
			plugins: [inferAdditionalFields<typeof auth>(), adminClient()]
		});
		const rawSession = fromStore(this.authClient.useSession());

		$effect(() => {
			if (rawSession.current.isPending) return;
			this.current = rawSession.current.data;
		});
	}

	async signOut() {
		const res = await this.authClient.signOut();
		await invalidateAll();
		return res;
	}

	async signInSocial(provider: SocialProvider) {
		return await this.authClient.signIn.social({
			provider: provider,
			callbackURL: page.route.id?.toString()
		});
	}
}

export const [useSession, setSession] = createContext<SessionState>();
