import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { formSchema } from "./validation";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { hasPermission } from "$lib/user/permission";
import { Permission } from "$lib/user/types";
import { createMusicId, deleteMusicId, getMusicId } from "$lib/music-id";

export const load: PageServerLoad = async (event) => {
	return {
		user: event.locals.user,
		userIsAdmin: await hasPermission(
			event.locals.pb,
			event.locals.user?.id,
			Permission.MANAGE_MUSIC_IDS
		),
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const user = event.locals.user;

		if (!user)
			return fail(403, {
				form
			});

		try {
			await createMusicId(event.locals.pb, {
				name: form.data.name,
				roblox_id: Number(form.data.id),
				owner: user.id
			});
		} catch (e) {
			setError(form, "something unexpected went wrong");
			return fail(500, {
				form
			});
		}

		return {
			form
		};
	},
	delete: async (event) => {
		const form = await event.request.formData();
		const formDataId = String(form.get("id"));

		if (!event.locals.user) return fail(403);

		const { user } = event.locals;
		const id = await getMusicId(event.locals.pb, formDataId);

		const hasPermissionToDelete =
			user.id === id.owner || hasPermission(event.locals.pb, user.id, Permission.MANAGE_MUSIC_IDS);

		if (!hasPermissionToDelete)
			return fail(403, {
				message: "you do not have permission to do that"
			});

		try {
			await deleteMusicId(event.locals.pb, id.id);
		} catch (e) {
			console.error(e);
			return fail(500, {
				message: "something unexpected went wrong"
			});
		}

		return {};
	}
};
