import { Link } from "@tanstack/solid-router";

export function Header() {
	return (
		<nav class="bg-gray-500 text-white flex gap-2 py-2 items-center pl-2">
			<Link to="/">home</Link>
			<div class="rounded-md px-2 ml-auto bg-amber-500">
				<p>i'm restructuring a bit so the website will be a bit bare-bones for a while</p>
			</div>
			<br />
		</nav>
	);
}
