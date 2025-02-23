type Timeout = {
	scope: string;
	id: number;
};

const timeouts = $state<Timeout[]>([]);

function createTimeout(scope: string, handler: () => void, timeout: number) {
	const id = setTimeout(() => {
		handler();
	}, timeout);

	const newTimeout: Timeout = {
		// @ts-expect-error it's fine
		id: id,
		scope: scope
	};

	timeouts.push(newTimeout);

	return newTimeout;
}

function clearTimeouts(scope: string) {
	timeouts.forEach((value, index) => {
		if (value.scope === scope) {
			clearTimeout(value.id); // Clear the timeout
			timeouts.splice(index, 1); // Remove the timeout from the array
		}
	});
}

export { createTimeout, timeouts, clearTimeouts };
