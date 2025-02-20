import { CookieState } from "$lib/cookie-state.svelte";
import { getContext, setContext } from "svelte";
import type { IdFormat } from "./format.svelte";

const FORMAT_CONTEXT_KEY = Symbol("FORMAT_CTX");

export function setFormatState<T extends IdFormat>(key: string, initialValue: T) {
	return setContext(FORMAT_CONTEXT_KEY, new CookieState(key, initialValue));
}

export function getFormatState() {
	return getContext<ReturnType<typeof setFormatState<IdFormat>>>(FORMAT_CONTEXT_KEY);
}
