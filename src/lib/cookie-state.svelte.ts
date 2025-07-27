import * as cookie from "cookie";
import { browser } from "$app/environment";
import { PersistedState, watch } from "runed";

export class CookieState<T> {
	#key: string;
	#persistedState: PersistedState<T>;

	constructor(key: string, initialValue: T) {
		this.#key = key;
		this.#persistedState = new PersistedState(this.#key, initialValue);

		watch.pre([() => this.#persistedState, () => this.#persistedState.current], (e) => {
			const localStorageItem = JSON.parse(localStorage.getItem(this.#key) ?? `""`);

			if (localStorageItem !== this.#persistedState.current) {
				console.warn("local storage and cookie isn't synchronised. syncing them now");
				console.dir({
					localStorage: localStorageItem,
					cookie: this.#persistedState.current
				});
				localStorage.setItem(this.#key, JSON.stringify(this.#persistedState.current));
			}
		});

		if (browser) {
			const existingCookie = cookie.parse(document.cookie)[key];
			if (!existingCookie) {
				this.#persistedState.current = initialValue;
				return;
			}

			const parsedResult = JSON.parse(existingCookie);
			this.#persistedState.current = parsedResult;
			return;
		}

		this.#persistedState.current = initialValue;
	}

	#setCookie(key: string, value: string): void {
		document.cookie = cookie.serialize(key, value, {
			expires: new Date(+new Date() + 3e10)
		});
	}

	get current() {
		return this.#persistedState.current;
	}
	set current(newValue: T) {
		this.#persistedState.current = newValue;
		this.#serialize(newValue);
	}

	#serialize(value: T): void {
		try {
			const serialized = JSON.stringify(value);
			this.#setCookie(this.#key, serialized);
			localStorage.setItem(this.#key, serialized);
		} catch (error) {
			console.error(`Error when writing value from persisted store "${this.#key}"`, error);
		}
	}
}
