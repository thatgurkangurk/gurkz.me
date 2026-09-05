type Timeout = {
	scope: string;
	id: ReturnType<typeof setTimeout>;
};

const timeouts = $state<Timeout[]>([]);

function createTimeout(scope: string, handler: () => void, timeout: number): Timeout {
	const id = setTimeout(() => {
		removeTimeout(id);
		handler();
	}, timeout);

	const newTimeout: Timeout = { id, scope };
	timeouts.push(newTimeout);

	return newTimeout;
}

function clearTimeouts(scope: string) {
	console.debug("clearing timeouts for scope", scope);

	for (const item of timeouts) {
		if (item.scope === scope) {
			clearTimeout(item.id);
		}
	}

	const remaining = timeouts.filter((item) => item.scope !== scope);
	timeouts.length = 0;
	timeouts.push(...remaining);
}

function removeTimeout(id: ReturnType<typeof setTimeout>) {
	const index = timeouts.findIndex((item) => item.id === id);
	if (index !== -1) {
		timeouts.splice(index, 1);
	}
}

export { createTimeout, clearTimeouts, type Timeout };
