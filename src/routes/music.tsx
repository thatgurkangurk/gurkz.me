import { orpc } from "#lib/orpc.js";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MusicCard } from "#lib/features/music/music-card.js";
import { FormatSelector } from "#lib/features/music/format-selector.js";

export const Route = createFileRoute("/music")({
    component: RouteComponent,
    loader: async ({ context }) => {
        await context.queryClient.query({
            ...orpc.music.list.queryOptions(),
            staleTime: "static",
        });
    },
});

function RouteComponent() {
    const { data } = useSuspenseQuery(orpc.music.list.queryOptions());
    return (
        <>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                music id list
            </h1>

            <FormatSelector />

            <div className="grid w-full grid-cols-1 place-items-center gap-4 py-6 transition-opacity duration-300 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
                {data.map((item) => (
                    <MusicCard key={item.id} musicId={item} />
                ))}
            </div>
        </>
    );
}
