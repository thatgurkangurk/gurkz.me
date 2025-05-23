import { Link } from "@tanstack/solid-router";

export function Header() {
	return (
		<nav class="bg-gray-500 text-white flex gap-2 py-2 items-center pl-2">
			<Link to="/">home</Link>
			<Link to="/music">music ids</Link>
			<div class="rounded-md px-2 ml-auto bg-amber-500">
				<p>construction in progress</p>
			</div>
			<br />
		</nav>
	);
}
