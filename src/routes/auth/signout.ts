import { redirect } from "@solidjs/router";
import type { APIEvent } from "@solidjs/start/server";
import { eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { sessions } from "~/lib/schema/session";

export async function POST(event: APIEvent) {
	if (!event.locals.session || !event.locals.user) {
		return redirect("/");
	}

	try {
		await db.delete(sessions).where(eq(sessions.id, event.locals.session.id));
		event.locals.session = null;
		event.locals.user = null;

		return redirect("/");
	} catch (err) {
		console.error(err);

		return redirect("/");
	}
}
