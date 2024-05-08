import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	const getAuthMethods = async () => {
		return await locals.pb.collection("users").listAuthMethods();
	};
	return {
		providers: await getAuthMethods()
	};
};

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const token = form.get("token");
		if (!token || typeof token !== "string") {
			redirect(303, "/auth/login");
		}

		cookies.set("pb_auth", JSON.stringify({ token: token }), {
			path: "/",
			secure: false
		});

		redirect(303, "/");
	}
} satisfies Actions;
