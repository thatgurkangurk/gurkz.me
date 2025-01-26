import { authOptions } from "../auth";
import { getSession } from "@solid-mediakit/auth";
import { query, redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";

export const isAdminQuery = query(async () => {
    "use server";
    const event = getRequestEvent()!;
    const session = await getSession(event, authOptions);

    if (session?.user.role !== "ADMIN") throw redirect("/");

    return true;
}, "is-admin");
