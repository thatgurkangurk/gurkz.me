import cookie from "cookie";
import Cookies from "js-cookie";
import { browser } from "$app/environment";
import { createSubscriber } from "svelte/reactivity";
import { on } from "svelte/events";

type Serializer<T> = {
	serialize: (value: T) => string;
	deserialize: (value: string) => T;
};

export class CookieState<T> {
	#state: T = $state()!;
	#key: string = crypto.randomUUID();
	#subscribe?: VoidFunction;
	#serializer: Serializer<T>;

	constructor(key: string, initialValue: T) {
		this.#key = key;
		this.#serializer = { serialize: JSON.stringify, deserialize: JSON.parse };
		if (browser) {
			const existingCookie = Cookies.get(key);
			if (!existingCookie) {
				this.#state = initialValue;
				return;
			}

			const parsedResult = JSON.parse(existingCookie);
			this.#state = parsedResult;

			this.#subscribe = createSubscriber(() => {
				return on(window, "storage", this.#handleStorageEvent);
			});
			return;
		}

		this.#state = initialValue;
	}

	setCookie(key: string, value: string): void {
		document.cookie = cookie.serialize(key, value, {
			expires: new Date(+new Date() + 3e10)
		});
	}

	get current() {
		if (browser) {
			const localStorageItem = this.#serializer.deserialize(
				localStorage.getItem(this.#key) ?? `""`
			);

			if (localStorageItem !== this.#state) {
				console.warn("local storage and cookie isn't synchronised. syncing them now");
				console.dir({
					localStorage: localStorageItem,
					cookie: this.#state
				});
				localStorage.setItem(this.#key, this.#serializer.serialize(this.#state));
			}
		}
		this.#subscribe?.();
		return this.#state;
	}
	set current(newValue: T) {
		this.#state = newValue;
		this.#serialize(newValue);
	}

	#deserialize(value: string): void {
		try {
			this.#state = this.#serializer.deserialize(value);
		} catch (error) {
			console.error(`Error when parsing "${value}" from persisted store "${this.#key}"`, error);
		}
	}

	#serialize(value: T): void {
		try {
			const serialized = this.#serializer.serialize(value);
			this.setCookie(this.#key, serialized);
			localStorage.setItem(this.#key, serialized);
		} catch (error) {
			console.error(`Error when writing value from persisted store "${this.#key}"`, error);
		}
	}

	#handleStorageEvent = (event: StorageEvent): void => {
		if (event.key !== this.#key || event.newValue === null) return;

		this.#deserialize(event.newValue);
	};
}
