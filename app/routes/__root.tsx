import { Header } from "../components/header";
import { QueryProvider } from "../components/tanstack-query";
import styles from "../styles/app.css?url";
import { Outlet, createRootRoute } from "@tanstack/solid-router";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charset: "utf-8"
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				title: "gurkan's website"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles
			}
		]
	}),
	notFoundComponent: () => <p>not found, sorry :(</p>,
	component: RootComponent
});

function RootComponent() {
	return (
		<QueryProvider>
			<Header />
			<Outlet />
		</QueryProvider>
	);
}
