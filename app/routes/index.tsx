import { useInfiniteQuery } from "@tanstack/solid-query";
import { createFileRoute } from "@tanstack/solid-router";
import { orpc } from "../lib/orpc";
import { createSignal, For, Show } from "solid-js";
import { makePersisted } from "@solid-primitives/storage";
import { isServer } from "solid-js/web";
import localforage from "localforage";
import { getUser } from "./__root";
import { signIn, signOut } from "../actions/auth";

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{
				title: "home - gurkan's website"
			}
		]
	}),
	loader: () => getUser(),
	component: RouteComponent
});

function formatId(id: string, format: "DEFAULT" | "TRAITOR_TOWN"): string {
	switch (format) {
		case "DEFAULT":
			return id;
		case "TRAITOR_TOWN":
			return `s/${id}`;
	}
}

function RouteComponent() {
	const [format, setFormat] = makePersisted(createSignal<"DEFAULT" | "TRAITOR_TOWN">("DEFAULT"), {
		storage: !isServer ? localforage : undefined,
		name: "id_format"
	});
	const query = useInfiniteQuery(() =>
		orpc.music.getMusicIds.infiniteOptions({
			input: (pageParam: string | null) => ({
				cursor: pageParam,
				limit: 10,
				verifiedOnly: true
			}),
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			initialPageParam: null
		})
	);
	const data = Route.useLoaderData();

	return (
		<>
			<p>hello, world!</p>
			<Show
				when={data()}
				fallback={
					<>
						<form action={signIn.url} method="post">
							<button type="submit">sign in</button>
						</form>
					</>
				}
			>
				<p>hi, {data()?.username}</p>
				<form action={signOut.url} method="post">
					<button type="submit">sign out</button>
				</form>
			</Show>

			<div class="flex gap-2 bg-gray-200 w-fit p-2">
				<button
					disabled={format() === "DEFAULT"}
					class="p-2 bg-green-200 disabled:bg-green-500"
					onClick={() => setFormat("DEFAULT")}
				>
					default
				</button>
				<button
					disabled={format() === "TRAITOR_TOWN"}
					class="p-2 bg-green-200 disabled:bg-green-500"
					onClick={() => setFormat("TRAITOR_TOWN")}
				>
					traitor
				</button>
			</div>

			<Show when={query.isFetched && query.data} fallback={<p>loading...</p>}>
				<For each={query.data?.pages}>
					{(page) => (
						<For each={page.data}>
							{(musicId) => {
								const [isCopying, setIsCopying] = createSignal<boolean>(false);

								return (
									<p>
										{musicId.name} - {formatId(musicId.robloxId, format())}
										<button
											onClick={() => {
												setIsCopying(true);
												navigator.clipboard.writeText(formatId(musicId.robloxId, format()));
												setTimeout(() => {
													setIsCopying(false);
												}, 300);
											}}
											class="underline"
										>
											<Show when={isCopying()} fallback="copy">
												copied
											</Show>
										</button>
									</p>
								);
							}}
						</For>
					)}
				</For>

				<Show when={query.hasNextPage}>
					<button onClick={() => query.fetchNextPage()} class="p-2 border-2 rounded-xl">
						fetch more
					</button>
				</Show>
			</Show>
		</>
	);
}
