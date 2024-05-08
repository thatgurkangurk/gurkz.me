import type { RequestHandler } from "./$types";
import { getMusicId } from "$lib/music-id";

export const GET: RequestHandler = async ({ params, locals }) => {
	const { id } = params;

	if (!id) {
		return new Response(
			JSON.stringify({
				message: "please provide an id"
			}),
			{
				status: 422
			}
		);
	}

	const res = await getMusicId(locals.pb, id);

	if (!res)
		return new Response(
			JSON.stringify({
				message: "not found"
			}),
			{
				status: 404
			}
		);

	return new Response(JSON.stringify(res), {
		status: 200
	});
};
