import { createIsomorphicFn } from "@tanstack/react-start";
import {
	getCookie as tanstackGetCookie,
	setCookie as tanstackSetCookie,
} from "@tanstack/react-start/server";
import * as cookie from "cookie";
import { atom } from "jotai";
import type { ZodType } from "zod/v4";

const setCookie = createIsomorphicFn()
	.server((key: string, value: string, options: cookie.SerializeOptions) => {
		tanstackSetCookie(key, value, options);
	})
	.client((key: string, value: string, options: cookie.SerializeOptions) => {
		// biome-ignore lint/suspicious/noDocumentCookie: i could use CookieStore, but it is async only
		document.cookie = cookie.serialize(key, value, options);
	});

const getCookie = createIsomorphicFn()
	.server((key: string) => tanstackGetCookie(key))
	.client((key: string) => {
		const parsed = cookie.parse(document.cookie || "");
		return parsed[key];
	});

export function atomWithCookie<T>(
	key: string,
	initialValue: T,
	schema?: ZodType<T>,
) {
	const baseAtom = atom<T | undefined>(undefined);

	const derivedAtom = atom(
		(get) => {
			const current = get(baseAtom);
			if (current !== undefined) return current;

			const raw = getCookie(key);
			if (!raw) {
				get(baseAtom);
				return initialValue;
			}

			try {
				const parsed = schema ? schema.parse(JSON.parse(raw)) : JSON.parse(raw);
				return parsed;
			} catch {
				return initialValue;
			}
		},

		(get, set, update: T | ((prev: T) => T)) => {
			const prev = get(baseAtom) ?? initialValue;
			const next =
				typeof update === "function" ? (update as (p: T) => T)(prev) : update;

			const validated = schema ? schema.parse(next) : next;

			set(baseAtom, validated);

			setCookie(
				key,
				typeof validated === "string" ? validated : JSON.stringify(validated),
				{
					path: "/",
					sameSite: "lax",
					expires: new Date("9999-12-31"),
				},
			);
		},
	);

	return derivedAtom;
}
