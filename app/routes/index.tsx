import { createFileRoute } from "@tanstack/solid-router";

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
	return (
		<>
			<p>hello, world!</p>
		</>
	);
}
