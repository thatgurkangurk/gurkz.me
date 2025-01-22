"use server";

import { auth } from "./auth";
import { getWebRequest } from "vinxi/http";

export async function getSession() {
    "use server";
    const headers = getWebRequest().headers;
    return await auth.api.getSession({
        headers,
    });
}
