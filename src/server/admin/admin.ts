import { query, redirect } from "@solidjs/router";
import { auth } from "~/lib/auth/actions";

export const isAdminQuery = query(async () => {
    "use server";
    const user = await auth();

    if (!user || user.role !== "ADMIN") throw redirect("/");

    return true;
}, "is-admin");
