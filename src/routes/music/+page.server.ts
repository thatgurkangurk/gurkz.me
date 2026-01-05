import { error, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { message, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { createMusicIdSchema } from "./schemas";
import { musicIds } from "$lib/server/db/schema/music";

export const load = (async (ev) => {
	if (!ev.locals.user || !ev.locals.user.permissions.includes("VIEW_MUSIC_IDS")) throw error(403);

	const form = await superValidate(zod4(createMusicIdSchema));

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(createMusicIdSchema));

		console.log(form);

		if (!locals.user || !locals.user.permissions.includes("CREATE_MUSIC_IDS")) {
			return message(
				form,
				{
					type: "error",
					title: "error",
					text: "you are not allowed to do that"
				},
				{
					status: 403
				}
			);
		}

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await db.insert(musicIds).values({
				createdById: locals.user.id,
				name: form.data.name,
				tags: form.data.tags,
				robloxId: form.data.robloxId
			});
		} catch (err) {
			console.error("creating music id failed", err);
			return message(
				form,
				{
					type: "error",
					title: "error",
					text: "something unexpected went wrong. try again later"
				},
				{
					status: 500
				}
			);
		}

		return message(form, {
			title: "success",
			text: "created the music id successfully",
			type: "success"
		});
	}
} satisfies Actions;
