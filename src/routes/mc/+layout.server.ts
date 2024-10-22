import { superValidate } from "sveltekit-superforms";
import type { LayoutServerLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./lib/form";

export const load: LayoutServerLoad = async (event) => {
	const form = await superValidate(zod(formSchema), {
		defaults: {
			ip: event.params.ip,
		},
	});

	return { form };
};
