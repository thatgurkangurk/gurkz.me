import { createContext } from "svelte";
import type { Permix } from "permix";
import { createComponents, usePermix as libUsePermix } from "permix/svelte";
import type { PermissionsDefinition } from "./permix.js";

export const [getPermix, setPermix] = createContext<Permix<PermissionsDefinition>>();

const contextProxy = new Proxy({} as Permix<PermissionsDefinition>, {
	get(_, prop) {
		const instance = getPermix();
		if (!instance) {
			throw new Error("permix context is missing");
		}

		const value = (instance as any)[prop];
		return typeof value === "function" ? value.bind(instance) : value;
	}
});

export const { Check } = createComponents<PermissionsDefinition>(contextProxy);

export function usePermix() {
	return libUsePermix(contextProxy);
}
