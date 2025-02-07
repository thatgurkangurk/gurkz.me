import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import { createSignal } from "solid-js";

export const [verifiedOnly, setVerifiedOnly] = makePersisted(
    // eslint-disable-next-line solid/reactivity
    createSignal<boolean>(true),
    {
        storage: cookieStorage.withOptions({
            expires: new Date(+new Date() + 3e10),
        }),
        name: "music-id-verified-only",
    }
);
