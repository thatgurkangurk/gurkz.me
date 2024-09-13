import { getMusicIds } from "$lib/server/music";
import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";
import { createMusicIdSchema } from "$lib/music";
import { hasPermission } from "$lib/server/permissions";
import { db } from "$lib/db";
import { musicIds } from "$lib/schema/music";

export const load: PageServerLoad = async (event) => {
	const ids = await getMusicIds();
	const form = await superValidate(zod(createMusicIdSchema));
	const data = await event.parent();
	const canCreateMusicIds = hasPermission(data.user, "CREATE_MUSIC_IDS");

	return {
		...data,
		ids,
		form,
		canCreateMusicIds,
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(createMusicIdSchema));

		if (!form.valid) {
			return fail(400, {
				form,
			});
		}

		if (!locals.user || !hasPermission(locals.user, "CREATE_MUSIC_IDS")) {
			return fail(403, { form });
		}

		await db.insert(musicIds).values({
			name: form.data.name,
			robloxId: parseInt(form.data.id),
			createdById: locals.user.id,
		});

		return message(form, "success");
	},
};
