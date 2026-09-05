import { orpc } from "#lib/orpc.js";
import { keepPreviousData } from "@tanstack/react-query";

const LIMIT = 20;

export function musicIdsInfiniteQueryOptions(search: string = "") {
    return orpc.music.list.infiniteOptions({
        input: (pageParam) => ({
            limit: LIMIT,
            search,
            page: pageParam,
        }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === LIMIT ? allPages.length + 1 : undefined;
        },
        placeholderData: keepPreviousData,
    });
}
