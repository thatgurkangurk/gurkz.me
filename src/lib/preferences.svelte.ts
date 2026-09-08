import { getUserPreferences } from "#lib/cookie-consent.js";

import * as cookie from "cookie";
import { createContext } from "svelte";
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

export class PreferencesStore {
	#state = $state<UserPreferences>(initialPreferences);

	constructor(initialData?: UserPreferences) {
		if (initialData) {
			this.#state = initialData;
		}
	}

	get current() {
		return this.#state;
	}

	get musicIdFormat() {
		return this.#state.musicIdFormat;
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

		const preferences = getUserPreferences();

		if (preferences?.acceptedCategories?.includes("preferences")) {
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
