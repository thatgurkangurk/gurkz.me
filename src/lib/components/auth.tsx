import { createAsync } from "@solidjs/router";
import { getAuthenticatedUser } from "../auth/utils";
import { Show } from "solid-js";

export function Auth() {
	const user = createAsync(() => getAuthenticatedUser());

	return (
		<div>
			<Show
				when={user()}
				fallback={
					<>
						<p>no user</p>
						<a rel="external" href="/auth/discord">
							log in
						</a>
					</>
				}
			>
				<p>hi, {user()?.username}</p>
				<form method="post" action="/auth/signout">
					<button type="submit">log out</button>
				</form>
			</Show>
		</div>
	);
}
