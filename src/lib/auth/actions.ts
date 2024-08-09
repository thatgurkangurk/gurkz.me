import { action, redirect, useLocation } from "@solidjs/router";
import { getRequestEvent, isDev } from "solid-js/web";
import { db } from "../db";
import { sessions } from "../schema/session";
import { eq } from "drizzle-orm";
import { generateState } from "arctic";
import { setCookie } from "vinxi/http";
import { getDiscordAuthorisationUrl } from "./discord";

export const logoutAction = action(async (formData: FormData) => {
	"use server";
	const event = getRequestEvent();
	const redirectTo = formData.get("redirect-to")?.toString() ?? "/";

	if (!event || !event.locals.session || !event.locals.user) {
		return redirect(redirectTo);
	}

	try {
		await db.delete(sessions).where(eq(sessions.id, event.locals.session.id));
		event.locals.session = null;
		event.locals.user = null;

		return redirect(redirectTo);
	} catch (err) {
		console.error(err);

		return redirect(redirectTo);
	}
});

export const discordLoginAction = action(async (formData: FormData) => {
	"use server";
	const state = generateState();
	const url = await getDiscordAuthorisationUrl(state);

	const redirectTo = formData.get("redirect-to")?.toString() ?? "/";

	setCookie("redirect_to", redirectTo, {
		path: "/",
		secure: !isDev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax",
	});

	setCookie("discord_oauth_state", state, {
		path: "/",
		secure: !isDev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax",
	});
	return redirect(url.toString());
});
