import { orpc } from "#lib/orpc.js";
import { MusicId } from "#lib/server/db/schema.js";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/music")({
    component: RouteComponent,
    loader: async ({ context }) => {
        await context.queryClient.query({
            ...orpc.music.list.queryOptions(),
            staleTime: "static",
        });
    },
});

function MusicCard(
    props: Readonly<{
        musicId: MusicId;
    }>,
) {
    return (
        <div
            key={props.musicId.id}
            className="rounded border border-gray-800 bg-gray-900/50 p-3"
        >
            <p className="m-0 font-bold text-gray-100">{props.musicId.name}</p>
            <p className="m-0 text-sm text-gray-400">
                id: {props.musicId.robloxId}
            </p>
        </div>
    );
}

function RouteComponent() {
    const { data } = useSuspenseQuery(orpc.music.list.queryOptions());
    return (
        <>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                hello there 👀
            </h1>

            <div className="flex flex-col gap-2">
                {data.map((item) => (
                    <MusicCard key={item.id} musicId={item} />
                ))}
            </div>
        </>
    );
}
