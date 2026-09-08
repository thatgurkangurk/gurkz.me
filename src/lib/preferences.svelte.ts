import { getUserPreferences, validConsent } from "#lib/cookie-consent.js";

import * as cookie from "cookie";
import { createContext } from "svelte";
import type { UserPreferences as CookieConsentUserPreferences } from "vanilla-cookieconsent";
import { z } from "zod";

export const idFormatSchema = z.optional(z.enum(["DEFAULT", "TRAITOR_TOWN"])).default("DEFAULT");

export type IdFormat = z.infer<typeof idFormatSchema>;

export const userPreferencesSchema = z.object({
	musicIdFormat: idFormatSchema.default("DEFAULT")
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export const initialPreferences: UserPreferences = {
	musicIdFormat: "DEFAULT"
};

export type ConsentCategories = {
	necessary: boolean;
	preferences: boolean;
	analytics: boolean;
	marketing: boolean;
	[key: string]: boolean;
};

export class PreferencesStore {
	#state = $state<UserPreferences>(initialPreferences);
	#consent = $state<CookieConsentUserPreferences>({
		acceptType: "necessary",
		acceptedCategories: [],
		rejectedCategories: [],
		acceptedServices: {},
		rejectedServices: {}
	});

	constructor(initialData?: UserPreferences) {
		if (initialData) {
			this.#state = initialData;
		}

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

	get current() {
		return this.#state;
	}

	get musicIdFormat() {
		return this.#state.musicIdFormat;
	}

	get consent() {
		return this.#consent;
	}

	get hasPreferencesConsent() {
		return this.#consent.acceptedCategories.includes("preferences");
	}

	set musicIdFormat(format: IdFormat) {
		this.update({ musicIdFormat: format });
	}

	update(
		partial: Partial<UserPreferences> | ((prev: UserPreferences) => Partial<UserPreferences>)
	) {
		const partialNext = typeof partial === "function" ? partial(this.#state) : partial;
		const next = { ...this.#state, ...partialNext };

		const validated = userPreferencesSchema.parse(next);
		this.#state = validated;

		this.#persistToCookie(validated);
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
