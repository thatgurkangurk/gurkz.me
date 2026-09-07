import { getUserPreferences } from "#lib/cookie-consent.js";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie as tanstackGetCookie } from "@tanstack/react-start/server";
import * as cookie from "cookie";
import { atom } from "jotai";
import { z } from "zod";

export const idFormatSchema = z
    .optional(z.enum(["DEFAULT", "TRAITOR_TOWN"]))
    .default("DEFAULT");

export type IdFormat = z.infer<typeof idFormatSchema>;

export const userPreferencesSchema = z.object({
    musicIdFormat: idFormatSchema.default("DEFAULT"),
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

const initialPreferences: UserPreferences = {
    musicIdFormat: "DEFAULT",
};

export const getInitialPreferences = createIsomorphicFn()
    .server(() => {
        const raw = tanstackGetCookie
            ? tanstackGetCookie("user_preferences")
            : undefined;
        if (!raw) return initialPreferences;

        try {
            return userPreferencesSchema.parse(JSON.parse(raw));
        } catch {
            return initialPreferences;
        }
    })
    .client(() => {
        const raw = cookie.parseCookie(document.cookie || "").user_preferences;
        if (!raw) return initialPreferences;

        try {
            return userPreferencesSchema.parse(JSON.parse(raw));
        } catch {
            return initialPreferences;
        }
    });

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
                "not saving the cookie. preferences cookies have been rejected.",
                { name: key, value: value, ...options },
            );
        }
    });

const getCookie = createIsomorphicFn()
    .server((key: string) =>
        tanstackGetCookie ? tanstackGetCookie(key) : undefined,
    )
    .client((key: string) => {
        const parsed = cookie.parseCookie(document.cookie || "");
        return parsed[key];
    });

function atomWithCookie<T extends object>(
    key: string,
    initialValue: T,
    schema?: z.ZodType<T>,
) {
    const baseAtom = atom<T | undefined>(undefined);

    return atom(
        (get): T => {
            const current = get(baseAtom);
            if (current !== undefined) return current;

            const raw = getCookie(key);
            if (!raw) return initialValue;

            try {
                const parsedJSON = JSON.parse(raw);
                return schema ? schema.parse(parsedJSON) : parsedJSON;
            } catch {
                return initialValue;
            }
        },
        (get, set, update: Partial<T> | ((prev: T) => Partial<T>)) => {
            const prev = get(baseAtom) ?? initialValue;
            const partialNext =
                typeof update === "function" ? update(prev) : update;

            const next = { ...prev, ...partialNext };
            const validated = schema ? schema.parse(next) : next;

            set(baseAtom, validated);

            setCookie(key, JSON.stringify(validated), {
                path: "/",
                sameSite: "lax",
                expires: new Date("9999-12-31"),
            });
        },
    );
}

export const preferencesAtom = atomWithCookie(
    "user_preferences",
    initialPreferences,
);
