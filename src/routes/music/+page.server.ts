import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { formSchema } from "./validation";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { hasPermission } from "$lib/user/permission";
import { Permission } from "$lib/db/schema/user";
import { db } from "$lib/db/client";
import { musicIds } from "$lib/db/schema/music-id";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

async function getAllIds() {
	const ids = await db.select().from(musicIds);

	return ids;
}

async function getId(id: string) {
	const musicId = await db.select().from(musicIds).where(eq(musicIds.id, id));

	return musicId[0];
}

export const load: PageServerLoad = async (event) => {
	return {
		user: event.locals.user,
		userIsAdmin: await hasPermission(event.locals.user?.id, Permission.MUSIC_ADMIN),
		form: await superValidate(zod(formSchema)),
		ids: await getAllIds()
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

		const userIsMusicAdmin = await hasPermission(user.id, Permission.MUSIC_ADMIN);

		try {
			await db.insert(musicIds).values({
				id: nanoid(32),
				ownerId: user.id,
				approved: userIsMusicAdmin,
				robloxId: form.data.id,
				name: form.data.name,
				ownerUsername: user.username
			});
		} catch (e) {
			console.error(e);
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
		const id = await getId(formDataId);

		const hasPermissionToDelete =
			user.id === id.ownerId || hasPermission(user.id, Permission.MUSIC_ADMIN);

		if (!hasPermissionToDelete)
			return fail(403, {
				message: "you do not have permission to do that"
			});

		try {
			await db.delete(musicIds).where(eq(musicIds.id, id.id));
		} catch (e) {
			console.error(e);
			return fail(500, {
				message: "something unexpected went wrong"
			});
		}

		return {};
	}
};
