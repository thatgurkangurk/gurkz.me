import { redirect } from "@sveltejs/kit";

export async function load() {
	return redirect(308, "/tools/cipher");
}
