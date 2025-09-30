import { orpc } from "$lib/orpc";

export async function load({ parent }) {
	const { queryClient } = await parent();

	await queryClient.ensureQueryData(orpc.session.get.queryOptions());

	return {};
}
