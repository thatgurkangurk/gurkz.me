import { db } from "$lib/server/db";
import { message, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { schema } from "./form";
import type { Actions } from "./$types";
import { fail } from "sveltekit-superforms";
import { auth } from "$lib/server/auth";
import { hasPermission } from "$lib/permissions";
import { musicIds } from "$lib/server/db/schema/music";

export async function load() {
	const musicIds = await db.query.musicIds.findMany();
	const form = await superValidate(zod4(schema));

	return {
		musicIds: musicIds,
		form: form
	};
}

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(schema));

		if (!form.valid) return fail(400, { form });

		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session) return fail(403, { form });

		if (!hasPermission(session.user, "CREATE_MUSIC_IDS")) return fail(403, { form });

		await db.insert(musicIds).values({
			verified: hasPermission(session.user, "CREATE_AUTO_VERIFIED_MUSIC_IDS") ? true : false,
			createdById: session.user.id,
			name: form.data.name,
			robloxId: form.data.robloxId,
			tags: form.data.tags
		});

		return message(form, "done");
	}
};
