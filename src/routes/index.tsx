import { RouteDefinition, useNavigate } from "@solidjs/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import { QueryBoundary } from "~/components/query-boundary";
import { Button } from "~/components/ui/button";
import { orpc } from "~/lib/orpc";

export const route = {
	preload: async () => {
		const queryClient = useQueryClient();

		await queryClient.prefetchQuery(orpc.session.get.queryOptions());
	}
} satisfies RouteDefinition;

export default function Home() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const query = useQuery(() => orpc.session.get.queryOptions());
	const logoutMutation = useMutation(() =>
		orpc.session.logout.mutationOptions({
			onSuccess: (data) => {
				queryClient.invalidateQueries({
					queryKey: orpc.session.get.key()
				});
				navigate(data.redirectTo);
			}
		})
	);
	const loginMutation = useMutation(() =>
		orpc.session.login.mutationOptions({
			onSuccess: (data) => {
				window.location.href = data.redirectTo;
			}
		})
	);

	return (
		<>
			<h1 class="text-3xl">home</h1>
			<QueryBoundary
				query={query}
				notFoundFallback={
					<>
						<Button onClick={() => loginMutation.mutate()}>log in</Button>
					</>
				}
			>
				{(data) => (
					<>
						<p>hi, {data.name}</p>
						<Button onClick={() => logoutMutation.mutate()}>log out</Button>
					</>
				)}
			</QueryBoundary>
		</>
	);
}
