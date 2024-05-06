import { writable } from "svelte/store";

const timeouts = writable<number[]>([]);

function createTimeout(handler: () => void, timeout: number) {
	const id = setTimeout(() => {
		handler();
	}, timeout);

	timeouts.update((value) => {
		value.push(id);
		return value;
	});
}

function clearTimeouts() {
	const unsubscribe = timeouts.subscribe((values) => {
		values.forEach((value) => {
			clearTimeout(value);
		});
	});

	timeouts.set([]);

	unsubscribe();
}

export { createTimeout, timeouts, clearTimeouts };
