import PocketBase, { ClientResponseError } from "pocketbase";
import type { Post } from "$lib/posts/types";
import type { PageServerLoad } from "./$types";
import { error as skError } from "@sveltejs/kit";
import type { Response } from "$lib/api/types";
import { handleErrors } from "$lib/api/errors";

async function getPost(pb: PocketBase, slug: string): Promise<Response<Post>> {
	try {
		const posts = await pb
			.collection("posts")
			.getList<Post>(1, 1, { filter: `slug='${slug}'`, expand: "author" });
		return {
			data: posts.items[0]
		};
	} catch (err) {
		if (err instanceof ClientResponseError) {
			return {
				error: {
					message: "that post was not found",
					code: 404
				}
			};
		}

		return {
			error: {
				message: "something unexpected went wrong",
				code: 500
			}
		};
	}
}

export const load: PageServerLoad = async ({ locals, params }) => {
	const { data: post } = handleErrors(await getPost(locals.pb, params.slug));

	if (!post)
		skError(500, {
			message: "something unexpected went wrong"
		});

	return {
		post: post
	};
};
