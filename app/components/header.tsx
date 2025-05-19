import { Link } from "@tanstack/solid-router";

export function Header() {
	return (
		<nav class="bg-gray-500 text-white flex gap-2">
			<Link to="/">home</Link>
		</nav>
	);
}
