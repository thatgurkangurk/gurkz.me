import { setTokens } from ".";
import { client } from "./client";
import { action, query, redirect } from "@solidjs/router";
import { eq } from "drizzle-orm";
import * as v from "valibot";
import { deleteCookie, getCookie, getEvent } from "vinxi/http";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

const user = v.object({
    id: v.string(),
    username: v.string(),
});

const subjects = {
    user: user,
};

async function getOrCreateUser(id: string, username: string) {
    "use server";
    const user = await db.transaction(async (tx) => {
        const result = await tx.query.users.findFirst({
            where: eq(users.id, id),
        });

        if (!result) {
            const [newUser] = await tx
                .insert(users)
                .values({
                    id: id,
                    name: username,
                })
                .returning();

            return newUser;
        }

        return result;
    });

    return user;
}

export const auth = query(async () => {
    "use server";
    const event = getEvent();
    const accessToken = getCookie(event, "access_token");
    const refreshToken = getCookie(event, "refresh_token");

    if (!accessToken) {
        console.warn("no access token");
        return false;
    }

    const verified = await client.verify(subjects, accessToken, {
        refresh: refreshToken,
    });

    if (verified.err) {
        console.warn("verified error");
        console.error(verified.err);
        return false;
    }
    if (verified.tokens) {
        await setTokens(verified.tokens.access, verified.tokens.refresh);
    }

    const user = await getOrCreateUser(
        verified.subject.properties.id,
        verified.subject.properties.username
    );

    return user;
}, "openauth-get-auth");

export const login = action(async () => {
    "use server";
    const event = getEvent();
    const accessToken = getCookie(event, "access_token");
    const refreshToken = getCookie(event, "refresh_token");

    if (accessToken) {
        const verified = await client.verify(subjects, accessToken, {
            refresh: refreshToken,
        });
        if (!verified.err && verified.tokens) {
            await setTokens(verified.tokens.access, verified.tokens.refresh);
            return redirect("/");
        }
    }

    const headers = event.headers;
    const host = headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const { url } = await client.authorize(
        `${protocol}://${host}/api/callback`,
        "code"
    );
    return redirect(url);
}, "openauth-login");

export const logout = action(async () => {
    "use server";
    const event = getEvent();
    deleteCookie(event, "access_token");
    deleteCookie(event, "refresh_token");

    return redirect("/", { revalidate: "openauth-get-auth" });
}, "openauth-logout");
