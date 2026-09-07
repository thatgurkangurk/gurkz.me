import {
    useInfiniteQuery,
    keepPreviousData,
    noop,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MusicCard } from "#lib/features/music/music-card.js";
import { FormatSelector } from "#lib/features/music/format-selector.js";
import { musicIdsInfiniteQueryOptions } from "#lib/features/music/query.js";
import { Suspense, useEffect, useRef } from "react";
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
    IconAlertTriangle,
    IconRefresh,
} from "@tabler/icons-react";
import { createDebouncedAtom } from "#lib/util/debounced-atom.js";
import { Search } from "#lib/components/search.js";
import { Atom, Provider, useAtomValue } from "jotai";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import * as cookie from "cookie";
import { idFormatAtom, idFormatSchema } from "#lib/features/music/state.js";
import { useHydrateAtoms } from "jotai/utils";
import { AtomsHydrator } from "#lib/components/atoms-hydrator.js";

const getInitialIdFormat = createIsomorphicFn()
    .server(() => {
        const raw = getCookie("id_format");
        try {
            return idFormatSchema.parse(raw);
        } catch {
            return "DEFAULT";
        }
    })
    .client(() => {
        const raw = cookie.parseCookie(document.cookie).id_format;
        try {
            return idFormatSchema.parse(raw);
        } catch {
            return "DEFAULT";
        }
    });

export const Route = createFileRoute("/music")({
    component: RouteComponent,
    loader: async ({ context }) => {
        await context.queryClient.infiniteQuery({
            ...musicIdsInfiniteQueryOptions(""),
            staleTime: "static",
        });

        return {
            initialIdFormat: getInitialIdFormat(),
        };
    },
    errorComponent: ({ error, reset }) => {
        return (
            <div className="flex w-full items-center justify-center p-8">
                <Empty className="py-20 animate-in fade-in-50 duration-300">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <IconAlertTriangle className="h-10 w-10 text-destructive" />
                        </EmptyMedia>
                        <EmptyTitle>failed to load music page</EmptyTitle>
                        <EmptyDescription>
                            {error.message || "an unexpected error occurred"}
                        </EmptyDescription>
                    </EmptyHeader>
                    <button
                        onClick={() => reset()}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        <IconRefresh className="h-4 w-4" />
                        try again
                    </button>
                </Empty>
            </div>
        );
    },
});

function MusicGrid({
    searchAtom,
    isSearchingAtom,
}: {
    searchAtom: Atom<string>;
    isSearchingAtom: Atom<boolean>;
}) {
    const search = useAtomValue(searchAtom);
    const isSearching = useAtomValue(isSearchingAtom);
    const loadMoreAnchorRef = useRef<HTMLDivElement>(null);
    const queryOptions = musicIdsInfiniteQueryOptions(search);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isError,
        error,
        refetch,
    } = useInfiniteQuery({
        ...queryOptions,
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData,
    });

    const musicIds = data?.pages.flatMap((page) => page) ?? [];

    useEffect(() => {
        const el = loadMoreAnchorRef.current;
        if (!el || !hasNextPage || isError) return;

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
    }, [hasNextPage, isFetchingNextPage, fetchNextPage, isError]);

    if (isError) {
        return (
            <Empty className="py-20 animate-in fade-in-50 duration-300">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <IconAlertTriangle className="h-10 w-10 text-destructive" />
                    </EmptyMedia>
                    <EmptyTitle>failed to fetch music ids</EmptyTitle>
                    <EmptyDescription>
                        {error instanceof Error
                            ? error.message
                            : "an unknown error occurred while searching"}
                    </EmptyDescription>
                </EmptyHeader>
                <button
                    onClick={() => refetch()}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
                >
                    <IconRefresh className="h-4 w-4" />
                    retry query
                </button>
            </Empty>
        );
    }

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

const musicSearchAtoms = createDebouncedAtom("", 400);

function RouteComponent() {
    const { initialIdFormat } = Route.useLoaderData();

    return (
        <Provider>
            <AtomsHydrator atomValues={[[idFormatAtom, initialIdFormat]]}>
                <MusicPage />
            </AtomsHydrator>
        </Provider>
    );
}

function MusicPage() {
    return (
        <div className="w-full space-y-8 p-8">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                music id list
            </h1>

            <FormatSelector />

            <Search
                label="search"
                placeholder="search music ids..."
                inputAtom={musicSearchAtoms.inputAtom}
                writeAtom={musicSearchAtoms.writeAtom}
                isLoading={musicSearchAtoms.isDebouncingAtom}
            />

            <Suspense fallback={<MusicGridSkeleton />}>
                <MusicGrid
                    searchAtom={musicSearchAtoms.debouncedAtom}
                    isSearchingAtom={musicSearchAtoms.isDebouncingAtom}
                />
            </Suspense>
        </div>
    );
}
