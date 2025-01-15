import { createQuery, isServer } from "@tanstack/solid-query";
import { api } from "astro-typed-api/client";
import { queryClient } from "~/lib/queryClient";

export function useMusicIds() {
    return createQuery(
        () => ({
            queryKey: ["music", "getMusicIds"],
            queryFn: async () => {
                if (isServer) {
                    const { getMusicIds } = await import(
                        "~/pages/api/music/getMusicIds"
                    );
                    const data = await getMusicIds.fetch();
                    return data;
                }
                const data = await api.music.getMusicIds.GET.fetch();
                return data;
            },
        }),
        () => queryClient
    );
}
