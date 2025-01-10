import { useIdFormat } from "../../pages/music/_idFormat";
import type { IdFormat } from "../../pages/music/_types";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

export function FormatSelector() {
    const [idFormat, setIdFormat] = useIdFormat();

    return (
        <>
            <Tabs
                value={idFormat()}
                onChange={(value) => setIdFormat(value as IdFormat)}
                class="max-w-[400px]"
            >
                <TabsList class="grid w-full grid-cols-2">
                    <TabsTrigger value="DEFAULT">default</TabsTrigger>
                    <TabsTrigger value="TRAITOR_TOWN">traitor town</TabsTrigger>
                </TabsList>
            </Tabs>
        </>
    );
}
