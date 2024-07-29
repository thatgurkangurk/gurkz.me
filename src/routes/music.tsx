import { Show } from "solid-js";
import { trpc } from "~/lib/trpc/client";

export default function MusicIdList() {
	const query = trpc.music.hello.createQuery();
	return (
		<>
			<h2 class="text-2xl">music id list</h2>
			<Show when={!query.isFetching} fallback={<span>loading</span>}>
				<p>{query.data}</p>

				<button type="button" onClick={() => query.refetch()}>
					refetch
				</button>
			</Show>
		</>
	);
}
