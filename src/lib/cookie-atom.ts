import { atom } from "jotai";
import Cookies from "js-cookie";
import { ZodType } from "zod/v4";

export function atomWithCookie<T>(
  key: string,
  initialValue: T,
  schema?: ZodType<T>
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
      Cookies.set(
        key,
        typeof validatedValue === "string"
          ? validatedValue
          : JSON.stringify(validatedValue),
        { path: "/", sameSite: "lax" }
      );
    }
  );
}
