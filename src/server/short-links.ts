import { query, redirect } from "@solidjs/router";
import { auth } from "~/lib/auth/actions";

export const canCreateShortLinks = query(async () => {
    "use server";
    const user = await auth();

    if (!user || !user.permissions.includes("CREATE_SHORT_LINKS")) {
        throw redirect("/");
    }

    return true;
}, "can-create-short-links");
