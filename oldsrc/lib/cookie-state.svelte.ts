import * as cookie from "npm-cookie";
import { browser } from "$app/env";
import { getUserPreferences } from "./cookie-consent";

export class CookieState<T> {
	#key: string;
	#value = $state() as T;

	constructor(key: string, initialValue: T) {
		this.#key = key;
		this.#value = initialValue;

		if (browser) {
			const existingCookie = cookie.parseCookie(document.cookie)[key];
			if (existingCookie) {
				try {
					this.#value = JSON.parse(existingCookie);
				} catch (error) {
					console.error(`Error parsing cookie "${key}":`, error);
				}
			}
		}
	}

	#setCookie(key: string, value: string): void {
		document.cookie = cookie.stringifySetCookie({
			name: key,
			value: value,
			expires: new Date(+new Date() + 3e10),
			path: "/"
		});
	}

	get current(): T {
		return this.#value;
	}

	set current(newValue: T) {
		this.#value = newValue;

		const hasPreferenceConsent =
			browser && getUserPreferences().acceptedCategories.includes("preferences");
		if (hasPreferenceConsent) {
			this.#serialize(newValue);
		}
	}

	#serialize(value: T): void {
		try {
			const serialized = JSON.stringify(value);
			this.#setCookie(this.#key, serialized);
		} catch (error) {
			console.error(`Error when writing cookie "${this.#key}"`, error);
		}
	}
}
