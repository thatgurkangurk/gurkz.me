import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { IdFormat, idFormat, setIdFormat } from "~/lib/music/id-format";

export function FormatSelector() {
    return (
        <>
            <Tabs
                value={idFormat()}
                onChange={(value) => setIdFormat(value as IdFormat)}
                class="max-w-[400px]"
            >
                <TabsList class="grid w-full grid-cols-2">
                    <TabsTrigger value="NORMAL">default</TabsTrigger>
                    <TabsTrigger value="TRAITOR_TOWN">traitor town</TabsTrigger>
                </TabsList>
            </Tabs>
        </>
    );
}
