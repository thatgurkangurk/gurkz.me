import { createServerFn } from "@tanstack/solid-start";
import { Header } from "../components/header";
import { QueryProvider } from "../components/tanstack-query";
import { getSession } from "../server/auth";
import styles from "../styles/app.css?url";
import { Outlet, createRootRoute } from "@tanstack/solid-router";

export const getUser = createServerFn({
	method: "GET"
})
	.type("dynamic")
	.handler(async () => {
		const session = await getSession();

		return session;
	});

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
	beforeLoad: () => getUser(),
	notFoundComponent: () => <p>not found, sorry :(</p>,
	component: RootComponent,
	wrapInSuspense: true
});

function RootComponent() {
	return (
		<QueryProvider>
			<Header />
			<Outlet />
		</QueryProvider>
	);
}
