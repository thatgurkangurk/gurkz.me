import { superValidate } from "sveltekit-superforms";
import type { Actions } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./lib/form";
import { fail, redirect } from "@sveltejs/kit";
import {} from "zod-fetch";

export const actions: Actions = {
	ping: async ({ request }) => {
		const form = await superValidate(request, zod(formSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		return redirect(307, `/mc/${form.data.ip}`);
	},
};
