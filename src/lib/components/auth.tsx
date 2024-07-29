import { createAsync } from "@solidjs/router";
import { getAuthenticatedUser } from "../auth/utils";
import { Show } from "solid-js";

export function Auth() {
	const user = createAsync(() => getAuthenticatedUser());

	return (
		<Show when={user()} fallback={<span>no user</span>}>
			<p>hi, {user()?.username}</p>
		</Show>
	);
}
