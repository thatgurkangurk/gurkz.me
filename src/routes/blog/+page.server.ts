import PocketBase, { ClientResponseError } from "pocketbase";
import type { Post } from "$lib/posts/types";
import type { PageServerLoad } from "./$types";
import type { Response } from "$lib/api/types";
import { handleErrors } from "$lib/api/errors";
import { error } from "@sveltejs/kit";

async function getPosts(pb: PocketBase): Promise<Response<Post[]>> {
	try {
		const posts = await pb
			.collection("posts")
			.getFullList<Post>({ expand: "author", filter: "draft=false" });
		return {
			data: posts
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

export const load: PageServerLoad = async ({ locals }) => {
	const { data: posts } = handleErrors(await getPosts(locals.pb));

	if (!posts)
		error(500, {
			message: "something unexpected went wrong"
		});

	return {
		posts: posts
	};
};
