import { createQuery } from "@tanstack/solid-query";
import { getSession } from "~/server/session";

function useSession() {
    return createQuery(() => ({
        queryKey: ["auth", "session"],
        queryFn: async () => {
            return await getSession();
        },
    }));
}

export { useSession };
