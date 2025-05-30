import { A } from "@solidjs/router";

export function Nav() {
	return (
		<nav class="flex gap-2">
			<A href="/">home</A>
			<A href="/music">music id list</A>
		</nav>
	);
}
