import { createAsync } from "@solidjs/router";
import { Show } from "solid-js";
import { discordLoginAction, logoutAction } from "../lib/auth/actions";
import { getAuthenticatedUser } from "../lib/auth/utils";

export function Auth() {
	const user = createAsync(() => getAuthenticatedUser());

	return (
		<div>
			<Show
				when={user()}
				fallback={
					<>
						<p>no user</p>
						<form method="post" action={discordLoginAction}>
							<button type="submit">log in</button>
						</form>
					</>
				}
			>
				<p>hi, {user()?.username}</p>
				<form method="post" action={logoutAction}>
					<button type="submit">log out</button>
				</form>
			</Show>
		</div>
	);
}
