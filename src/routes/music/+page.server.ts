import { db } from "$lib/server/db";
import { safeParse } from "valibot";
import { idFormatSchema, type IdFormat } from "./components/format.svelte.js";
import { message, superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { createMusicIdSchema } from "./form.js";
import type { Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { defineMeta } from "$lib/meta.js";
import { call } from "@orpc/server";
import { createMusicId } from "../../router/music.js";

export async function load({ parent, cookies }) {
	const idFormatCookie = cookies.get("id_format") ?? `"DEFAULT"`;
	const parseResult = safeParse(idFormatSchema, JSON.parse(idFormatCookie));

	const idFormat: IdFormat = parseResult.success ? parseResult.output : "DEFAULT";

	const { subject } = await parent();

	const createMusicIdForm = await superValidate(
		{
			tags: []
		},
		valibot(createMusicIdSchema),
		{ errors: false }
	);

	return {
		idFormat,
		subject,
		createMusicIdForm,
		meta: defineMeta({
			title: "music id list"
		})
	};
}

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const form = await superValidate(request, valibot(createMusicIdSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (!locals.session) {
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
		}

		await call(
			createMusicId,
			{
				name: form.data.name,
				id: form.data.id,
				tags: form.data.tags
			},
			{
				context: {
					db: db,
					session: {
						name: locals.session.username,
						...locals.session
					}
				}
			}
		).catch((err) => {
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
