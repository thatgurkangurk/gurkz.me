import { RouteDefinition } from "@solidjs/router";
import { useQuery, useQueryClient } from "@tanstack/solid-query";
import { QueryBoundary } from "~/components/query-boundary";
import { orpc } from "~/lib/orpc";

export const route = {
	preload: async () => {
		const queryClient = useQueryClient();

		await queryClient.prefetchQuery(orpc.session.get.queryOptions());
	}
} satisfies RouteDefinition;

export default function Home() {
	const query = useQuery(() => orpc.session.get.queryOptions());
	return (
		<>
			<h1 class="text-3xl">home</h1>
			<QueryBoundary query={query}>{(data) => <p>hi, {data.name}!</p>}</QueryBoundary>
		</>
	);
}
