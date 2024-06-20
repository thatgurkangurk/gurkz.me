import { createStore } from "solid-js/store";

type Timeout = {
  scope: string;
  id: number;
};

const [timeouts, setTimeouts] = createStore<Timeout[]>([]);

function createTimeout(scope: string, handler: () => void, timeout: number) {
  const id = setTimeout(() => {
    handler();
  }, timeout);

  const newTimeout: Timeout = {
    // @ts-expect-error i dont know why this is NodeJS.Timeout, but it's fine
    id: id,
    scope: scope,
  };

  setTimeouts((otherTimeouts) => [...otherTimeouts, newTimeout]);
}

function clearTimeouts(scope: string) {
  timeouts.forEach((value) => {
    if (value.scope === scope) clearTimeout(value.id);
  });

  setTimeouts([]);
}

export { createTimeout, clearTimeouts };
