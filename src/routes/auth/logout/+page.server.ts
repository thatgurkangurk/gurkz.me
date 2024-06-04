import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
	default: async ({ cookies }) => {
		const sessionCookie = await cookies.get("session");

		if (!sessionCookie) redirect(302, "/");

		cookies.delete("session", {
			path: "/"
		});

		redirect(301, "/");
	}
} satisfies Actions;
