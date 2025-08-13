import { orpc } from "$lib/orpc.js";

export async function load({ parent, data }) {
	const { queryClient } = await parent();

	await queryClient.prefetchQuery(orpc.music.get.queryOptions());
	await queryClient.prefetchQuery(orpc.session.get.queryOptions());

	return { ...data };
}
