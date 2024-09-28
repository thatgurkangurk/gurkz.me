import type { z } from "zod";

export function getLocalStorage<T extends string>(
	key: string,
	zodSchema: z.ZodSchema,
	defaultValue: T
): T {
	if (typeof window === "undefined") return defaultValue;

	const data = window.localStorage.getItem(key);

	const parse = zodSchema.safeParse(data);

	if (!parse.success) return defaultValue;

	return parse.data;
}

export function setLocalStorage<T extends string>(key: string, zodSchema: z.ZodSchema, value: T) {
	if (typeof window === "undefined") return console.warn("isn't on client");

	const parse = zodSchema.safeParse(value);

	if (!parse.success) return console.warn("parsing failed");

	window.localStorage.setItem(key, value.toString());
}
