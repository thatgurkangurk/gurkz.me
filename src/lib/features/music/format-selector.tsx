import { useAtom } from "jotai";
import { Tabs, TabsList, TabsTrigger } from "#lib/components/ui/tabs.js";
import {
    idFormatAtom,
    ID_FORMAT_OPTIONS,
    type IdFormat,
} from "#lib/features/music/state.js";

export function FormatSelector() {
    const [idFormat, setIdFormat] = useAtom(idFormatAtom);

    return (
        <Tabs
            value={idFormat}
            onValueChange={(val) => setIdFormat(val as IdFormat)}
            className="w-fit"
        >
            <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground select-none">
                {ID_FORMAT_OPTIONS.map(({ value, label }) => (
                    <TabsTrigger
                        key={value}
                        value={value}
                        className="rounded-md px-3.5 py-1 text-xs font-semibold border-none shadow-none transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                    >
                        {label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
}
