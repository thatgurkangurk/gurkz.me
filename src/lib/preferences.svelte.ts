import { getUserPreferences, validConsent } from "#lib/cookie-consent.js";
import {
	MusicPreferencesStore,
	musicPreferencesSchema
} from "#lib/features/music/preferences.svelte.js";

import * as cookie from "cookie";
import { createContext } from "svelte";
import type { UserPreferences as CookieConsentUserPreferences } from "vanilla-cookieconsent";
import { z } from "zod";

export const userPreferencesSchema = z.object({
	music: musicPreferencesSchema.prefault({})
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export const initialPreferences: UserPreferences = {
	music: { idFormat: "DEFAULT" }
};

export class PreferencesStore {
	#consent = $state<CookieConsentUserPreferences>({
		acceptType: "necessary",
		acceptedCategories: [],
		rejectedCategories: [],
		acceptedServices: {},
		rejectedServices: {}
	});

	readonly music: MusicPreferencesStore;

	constructor(initialData?: UserPreferences) {
		const parsed = userPreferencesSchema.parse(initialData ?? {});

		const notify = () => this.#persistToCookie(this.current);
		this.music = new MusicPreferencesStore(parsed.music, notify);

		if (typeof window !== "undefined") {
			this.#syncConsentWithLibrary();
		}
	}

	#syncConsentWithLibrary() {
		const updateConsentState = () => {
			const userConsent = getUserPreferences();
			if (userConsent) {
				console.debug("updating user consent", userConsent);
				this.#consent = userConsent;
			}
		};

		if (validConsent()) {
			updateConsentState();
		}

		window.addEventListener("cc:onConsent", updateConsentState);
		window.addEventListener("cc:onChange", updateConsentState);
	}

	get consent() {
		return this.#consent;
	}

	get hasPreferencesConsent() {
		return this.#consent.acceptedCategories.includes("preferences");
	}

	get current(): UserPreferences {
		return {
			music: this.music.toJSON()
		};
	}

	#persistToCookie(data: UserPreferences) {
		if (typeof window === "undefined") return;

		if (this.hasPreferencesConsent) {
			document.cookie = cookie.stringifySetCookie({
				name: "user_preferences",
				value: JSON.stringify(data),
				path: "/",
				sameSite: "lax",
				expires: new Date("9999-12-31")
			});
		} else {
			console.debug("not saving the cookie. preferences cookies have been rejected.", {
				name: "user_preferences",
				value: JSON.stringify(data)
			});
		}
	}
}

export const [usePreferences, setPreferencesContext] = createContext<PreferencesStore>();
