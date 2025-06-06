import { A, useNavigate } from "@solidjs/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import { orpc } from "~/lib/orpc";
import { QueryBoundary } from "./query-boundary";
import { Button } from "./ui/button";
import { Show } from "solid-js";

function AuthStatus() {
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
		<QueryBoundary query={query}>
			{(data) => (
				<Show
					when={data.user}
					fallback={
						<Button variant={"link"} onClick={() => loginMutation.mutate()}>
							log in
						</Button>
					}
				>
					{(user) => (
						<div class="flex gap-2 items-center-safe">
							<p>hi, {user().name}</p>
							<Button variant={"link"} onClick={() => logoutMutation.mutate()}>
								log out
							</Button>
						</div>
					)}
				</Show>
			)}
		</QueryBoundary>
	);
}

export function Nav() {
	return (
		<nav class="px-2 flex gap-2 items-center">
			<A href="/">home</A>
			<A href="/music">music id list</A>

			<div class="ml-auto">
				<AuthStatus />
			</div>
		</nav>
	);
}
