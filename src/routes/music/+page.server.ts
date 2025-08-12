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
	const form = await superValidate(zod4(schema));

	return {
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

		if (!session)
			return message(
				form,
				{
					type: "error",
					text: "you need to be signed in to do this"
				},
				{
					status: 403
				}
			);

		if (!hasPermission(session.user, "CREATE_MUSIC_IDS")) return fail(403, { form });

		await db
			.insert(musicIds)
			.values({
				verified: hasPermission(session.user, "CREATE_AUTO_VERIFIED_MUSIC_IDS") ? true : false,
				createdById: session.user.id,
				name: form.data.name,
				robloxId: form.data.robloxId,
				tags: form.data.tags
			})
			.catch((err) => {
				console.error(err);
				return message(
					form,
					{
						type: "error",
						text: "could not create the music id"
					},
					{
						status: 500
					}
				);
			});

		return message(form, {
			text: "successfully created the music id",
			type: "success"
		});
	}
};
