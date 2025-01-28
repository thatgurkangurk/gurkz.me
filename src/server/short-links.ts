import { getSession } from "./session";
import { query, redirect } from "@solidjs/router";

export const canCreateShortLinks = query(async () => {
    "use server";
    const session = await getSession();

    if (!session?.user.permissions.includes("CREATE_SHORT_LINKS"))
        throw redirect("/");

    return true;
}, "can-create-short-links");
