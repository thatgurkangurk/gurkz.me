import { getUserPreferences } from "#lib/cookie-consent.js";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie as tanstackGetCookie } from "@tanstack/react-start/server";
import * as cookie from "cookie";
import { atom } from "jotai";
import type { ZodType } from "zod/v4";

const setCookie = createIsomorphicFn()
    .server((key: string, value: string, options: cookie.SerializeOptions) => {
        // @ts-expect-error i know
        if (process.env.NODE_ENV === "development") {
            console.log("not setting the cookie on the server");
        }
    })
    .client((key: string, value: string, options: cookie.SerializeOptions) => {
        const preferences = getUserPreferences();

        if (preferences.acceptedCategories.includes("preferences")) {
            document.cookie = cookie.stringifySetCookie({
                name: key,
                value: value,
                ...options,
            });
        } else {
            console.debug(
                "not saving the cookie. preferences cookies have been rejected. what i would have set:",
                {
                    name: key,
                    value: value,
                    ...options,
                },
            );
        }
    });

const getCookie = createIsomorphicFn()
    .server((key: string) => tanstackGetCookie(key))
    .client((key: string) => {
        const parsed = cookie.parseCookie(document.cookie || "");
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
                const parsed = schema
                    ? schema.parse(JSON.parse(raw))
                    : JSON.parse(raw);
                return parsed;
            } catch {
                return initialValue;
            }
        },

        (get, set, update: T | ((prev: T) => T)) => {
            const prev = get(baseAtom) ?? initialValue;
            const next =
                typeof update === "function"
                    ? (update as (p: T) => T)(prev)
                    : update;

            const validated = schema ? schema.parse(next) : next;

            set(baseAtom, validated);

            setCookie(
                key,
                typeof validated === "string"
                    ? validated
                    : JSON.stringify(validated),
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
