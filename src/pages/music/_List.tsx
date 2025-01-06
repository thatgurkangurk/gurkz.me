import { formatMusicId } from "./_idFormat";
import type { IdFormat, MusicId } from "./_types";
import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import { createSignal, For } from "solid-js";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

export function MusicList(props: {
    defaultFormat: IdFormat;
    musicIds: MusicId[];
}) {
    const [format, setFormat] = makePersisted(
        createSignal<IdFormat>(props.defaultFormat),
        {
            storage: cookieStorage,
            name: "id_format",
        }
    );

    return (
        <>
            <Tabs value={format()} onChange={setFormat} class="w-[400px]">
                <TabsList class="grid w-full grid-cols-2">
                    <TabsTrigger value="DEFAULT">default</TabsTrigger>
                    <TabsTrigger value="TRAITOR_TOWN">traitor town</TabsTrigger>
                </TabsList>
            </Tabs>
            <For each={props.musicIds}>
                {(musicId) => (
                    <p>
                        {musicId.name} -{" "}
                        {formatMusicId(musicId.robloxId, format())}
                    </p>
                )}
            </For>
        </>
    );
}
