import { ErrorBoundary, Suspense } from "solid-js";
import { Show } from "solid-js";
import { createAsync } from "@solidjs/router";
import { getAuthenticatedUser } from "~/lib/auth/utils";
import { MusicList } from "~/components/music/music-list";
import { CreateMusicCard } from "~/components/music/create-card";
import { IdFormatToggle } from "~/components/music/id-format";
import { LoaderCircle } from "lucide-solid";
import { getMusicIds } from "~/lib/music";
import { MusicCardSkeleton } from "~/components/music/music-card";

export default function MusicIdList() {
	const user = createAsync(() => getAuthenticatedUser());

	return (
		<>
			<h2 class="text-2xl">music id list</h2>

			<Show when={user()?.permissions.includes("CREATE_MUSIC_IDS")}>
				<CreateMusicCard />
			</Show>

			<Suspense>
				<IdFormatToggle />
			</Suspense>

			<ErrorBoundary
				fallback={(err, reset) => (
					<div>
						<p>sorry, something went wrong. error: {err.toString()}</p>{" "}
						<button type="button" onClick={() => reset()}>
							retry?
						</button>
					</div>
				)}
			>
				<Suspense
					fallback={
						<div class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4">
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
						</div>
					}
				>
					<MusicList />
				</Suspense>
			</ErrorBoundary>
		</>
	);
}
