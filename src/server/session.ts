"use server";

import { authOptions } from "./auth";
import { getSession as getAuthJsSession } from "@solid-mediakit/auth";
import { getRequestEvent } from "solid-js/web";

export async function getSession() {
    "use server";
    const event = getRequestEvent()!;
    return await getAuthJsSession(event, authOptions);
}
