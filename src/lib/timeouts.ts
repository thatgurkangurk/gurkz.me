import { atom } from "nanostores";

type Timeout = {
    scope: string;
    id: number;
};

const $timeouts = atom<Timeout[]>([]);

function createTimeout(scope: string, handler: () => void, timeout: number) {
    const id = setTimeout(() => {
        handler();
    }, timeout);

    const newTimeout: Timeout = {
        // @ts-expect-error i dont know why this is NodeJS.Timeout, but it's fine
        id: id,
        scope: scope,
    };

    $timeouts.set([...$timeouts.get(), newTimeout]);
}

function clearTimeouts(scope: string) {
    for (const value of $timeouts.get()) {
        if (value.scope === scope) clearTimeout(value.id);
    }

    $timeouts.set([]);
}

export { createTimeout, clearTimeouts };
