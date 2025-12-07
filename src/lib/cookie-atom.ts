import { createIsomorphicFn } from "@tanstack/react-start";
import { setCookie as tanstackSetCookie } from "@tanstack/react-start/server";
import * as cookie from "cookie";
import { atom } from "jotai";
import Cookies from "js-cookie";
import type { ZodType } from "zod/v4";

const setCookie = createIsomorphicFn()
	.server((key: string, value: string, options: cookie.SerializeOptions) => {
		tanstackSetCookie(key, value, options);
	})
	.client((key: string, value: string, options: cookie.SerializeOptions) => {
		// biome-ignore lint/suspicious/noDocumentCookie: cookieStore needs async
		document.cookie = cookie.serialize(key, value, options);
	});

export function atomWithCookie<T>(
	key: string,
	initialValue: T,
	schema?: ZodType<T>,
) {
	let savedValue: T | undefined;
	const cookie = Cookies.get(key);
	if (cookie) {
		try {
			const parsed = JSON.parse(cookie);
			savedValue = schema ? schema.parse(parsed) : parsed;
		} catch {
			savedValue = undefined;
		}
	}

	const baseAtom = atom<T>(savedValue ?? initialValue);

	return atom(
		(get) => get(baseAtom),
		(get, set, update: T | ((prev: T) => T)) => {
			const nextValue =
				typeof update === "function"
					? (update as (prev: T) => T)(get(baseAtom))
					: update;

			const validatedValue = schema ? schema.parse(nextValue) : nextValue;

			set(baseAtom, validatedValue);
			setCookie(
				key,
				typeof validatedValue === "string"
					? validatedValue
					: JSON.stringify(validatedValue),
				{
					path: "/",
					sameSite: "lax",
					expires: new Date(+new Date(3e10)),
				},
			);
		},
	);
}
