import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MusicCard } from "#lib/features/music/music-card.js";
import { FormatSelector } from "#lib/features/music/format-selector.js";
import { musicIdsInfiniteQueryOptions } from "#lib/features/music/query.js";
import { Suspense, useEffect, useRef, useState } from "react";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "#lib/components/ui/empty.js";
import {
    IconZoomExclamation,
    IconLoader,
    IconSearch,
    IconX,
} from "@tabler/icons-react";
import { Input } from "#lib/components/ui/input.js";
import { Label } from "#lib/components/ui/label.js";
import { useDebouncedValue } from "@tanstack/react-pacer";

export const Route = createFileRoute("/music")({
    component: MusicPage,
    loader: async ({ context }) => {
        await context.queryClient.infiniteQuery({
            ...musicIdsInfiniteQueryOptions(""),
            staleTime: "static",
        });
    },
});

function MusicGrid({
    search,
    isSearching,
}: {
    search: string;
    isSearching: boolean;
}) {
    const loadMoreAnchorRef = useRef<HTMLDivElement>(null);
    const queryOptions = musicIdsInfiniteQueryOptions(search);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            ...queryOptions,
            staleTime: 1000 * 60 * 5,
            placeholderData: keepPreviousData,
        });

    const musicIds = data?.pages.flatMap((page) => page) ?? [];

    useEffect(() => {
        const el = loadMoreAnchorRef.current;
        if (!el || !hasNextPage) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (musicIds.length === 0 && !isSearching) {
        return (
            <Empty className="py-20 animate-in fade-in-50 duration-300">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <IconZoomExclamation className="h-10 w-10 text-muted-foreground" />
                    </EmptyMedia>
                    <EmptyTitle>no music ids found</EmptyTitle>
                    <EmptyDescription>
                        try searching for something else
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    return (
        <div className="w-full">
            <div
                className={`grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 transition-all duration-300 ease-out ${
                    isSearching
                        ? "pointer-events-none opacity-40 scale-[0.99]"
                        : "opacity-100 scale-100"
                }`}
            >
                {musicIds.map((musicId) => (
                    <div
                        key={musicId.id}
                        className="transition-transform duration-200 ease-out hover:-translate-y-1"
                    >
                        <MusicCard musicId={musicId} />
                    </div>
                ))}
            </div>

            <div
                ref={loadMoreAnchorRef}
                className="flex w-full items-center justify-center py-12"
            >
                {isFetchingNextPage && (
                    <div className="flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
                        <IconLoader className="h-4 w-4 animate-spin text-primary" />
                        loading more...
                    </div>
                )}
            </div>
        </div>
    );
}

function MusicGridSkeleton() {
    return (
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
                <div
                    key={i}
                    className="h-40 w-full animate-pulse rounded-xl border bg-muted/30"
                />
            ))}
        </div>
    );
}

function MusicPage() {
    const [searchFilter, setSearchFilter] = useState("");
    const [debouncedSearchFilter] = useDebouncedValue(searchFilter, {
        wait: 400,
    });

    const isSearching = searchFilter !== debouncedSearchFilter;

    return (
        <div className="w-full space-y-8 p-8">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                music id list
            </h1>

            <FormatSelector />

            <div className="max-w-sm space-y-2">
                <Label htmlFor="search_filter">search</Label>
                <div className="relative flex items-center">
                    <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200" />

                    <Input
                        id="search_filter"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        placeholder="search music ids..."
                        className="pl-10 pr-10 transition-shadow duration-200 focus-visible:ring-2"
                    />

                    <div className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center">
                        {isSearching ? (
                            <IconLoader className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : searchFilter ? (
                            <button
                                type="button"
                                onClick={() => setSearchFilter("")}
                                className="rounded-sm opacity-70 ring-offset-background transition-all duration-200 hover:opacity-100 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <IconX className="h-4 w-4 text-muted-foreground" />
                                <span className="sr-only">clear search</span>
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>

            <Suspense fallback={<MusicGridSkeleton />}>
                <MusicGrid
                    search={debouncedSearchFilter}
                    isSearching={isSearching}
                />
            </Suspense>
        </div>
    );
}
