import { writable } from "svelte/store";

type Timeout = {
	scope: string;
	id: number;
};

const timeouts = writable<Timeout[]>([]);

function createTimeout(scope: string, handler: () => void, timeout: number) {
	const id = setTimeout(() => {
		handler();
	}, timeout);

	timeouts.update((value) => {
		const newTimeout: Timeout = {
			id: id,
			scope: scope,
		};
		value.push(newTimeout);
		return value;
	});
}

function clearTimeouts(scope: string) {
	const unsubscribe = timeouts.subscribe((values) => {
		values.forEach((value) => {
			if (value.scope === scope) clearTimeout(value.id);
		});
	});

	timeouts.set([]);

	unsubscribe();
}

export { createTimeout, timeouts, clearTimeouts };
