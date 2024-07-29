import { createAsync } from "@solidjs/router";
import { getAuthenticatedUser } from "../auth/utils";
import { Show } from "solid-js";
import { discordLoginAction, logoutAction } from "../auth/actions";

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
