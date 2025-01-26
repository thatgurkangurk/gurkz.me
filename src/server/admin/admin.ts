import { getSession } from "../session";
import { query, redirect } from "@solidjs/router";

export const isAdminQuery = query(async () => {
    "use server";
    const session = await getSession();

    if (session?.user.role !== "ADMIN") throw redirect("/");

    return true;
}, "is-admin");
