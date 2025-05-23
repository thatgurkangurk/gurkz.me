import { useQuery } from "@tanstack/solid-query";
import { createFileRoute } from "@tanstack/solid-router";
import { orpc } from "../lib/orpc";
import { Show } from "solid-js";
import { signIn, signOut } from "../actions/auth";

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{
				title: "home - gurkan's website"
			}
		]
	}),
	component: RouteComponent
});

function RouteComponent() {
	const userQuery = useQuery(() => orpc.auth.getUser.queryOptions());

	return (
		<>
			<p>hello, world!</p>
			<Show
				when={userQuery.isSuccess && userQuery.data.user}
				fallback={
					<>
						<form action={signIn.url} method="post">
							<button type="submit">sign in</button>
						</form>
					</>
				}
			>
				<p>hi, {userQuery.data?.user?.username}</p>
				<form action={signOut.url} method="post">
					<button type="submit">sign out</button>
				</form>
			</Show>
		</>
	);
}
