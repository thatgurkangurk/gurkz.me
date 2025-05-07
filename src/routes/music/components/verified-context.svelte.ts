import { getContext, setContext } from "svelte";

const FORMAT_CONTEXT_KEY = Symbol("VERIFIED_ONLY_CTX");

class State<T extends boolean> {
	#state = $state<T>()!;

	constructor(initialValue: T) {
		this.#state = initialValue;
	}

	get state() {
		return this.#state;
	}

	set state(value: T) {
		this.#state = value;
	}
}

export function setVerifiedOnlyState<T extends boolean>(initialValue: T) {
	return setContext(FORMAT_CONTEXT_KEY, new State(initialValue));
}

export function getVerifiedOnlyState() {
	return getContext<ReturnType<typeof setVerifiedOnlyState<boolean>>>(FORMAT_CONTEXT_KEY);
}
