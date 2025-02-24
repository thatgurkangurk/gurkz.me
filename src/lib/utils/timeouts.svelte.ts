import { getContext, setContext } from "svelte";

type Timeout = {
	scope: string;
	id: number;
};

class TimeoutState {
	#timeouts = $state<Timeout[]>([]);

	constructor() {}

	create(scope: string, handler: () => void, timeout: number) {
		const id = setTimeout(() => {
			handler();
		}, timeout);

		const newTimeout: Timeout = {
			// @ts-expect-error it's fine
			id: id,
			scope: scope
		};

		this.#timeouts.push(newTimeout);

		return newTimeout;
	}

	clear(scope: string) {
		this.#timeouts.forEach((value, index) => {
			if (value.scope === scope) {
				clearTimeout(value.id);
				this.#timeouts.splice(index, 1);
			}
		});
	}
}

const TIMEOUT_CONTEXT_KEY = Symbol("FORMAT_CTX");

export function setTimeoutState() {
	return setContext(TIMEOUT_CONTEXT_KEY, new TimeoutState());
}

export function getTimeoutState() {
	return getContext<ReturnType<typeof setTimeoutState>>(TIMEOUT_CONTEXT_KEY);
}

export { TimeoutState };
