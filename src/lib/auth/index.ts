"use server";

import { getEvent, setCookie } from "vinxi/http";

export async function setTokens(access: string, refresh: string) {
    "use server";
    const event = getEvent();
    setCookie(event, "access_token", access, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 34560000,
    });
    setCookie(event, "refresh_token", refresh, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 34560000,
    });
}
