import { orpc } from "$lib/orpc";

export async function load({ parent }) {
	const { queryClient } = await parent();

	await queryClient.prefetchQuery(orpc.session.get.queryOptions());

	return {};
}
