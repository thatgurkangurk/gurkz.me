import { Button } from "../ui/button";
import { FormatSelector } from "./format-selector";
import { VerifiedSelector } from "./verified-selector";
import { SettingsIcon, XIcon } from "lucide-solid";
import { createSignal, Show } from "solid-js";

export function MusicOptions() {
    const [open, setOpen] = createSignal(false);
    return (
        <>
            <Button
                size={"icon"}
                variant={"outline"}
                onClick={() => {
                    setOpen((current) => !current);
                }}
            >
                <Show when={open()} fallback={<SettingsIcon />}>
                    <XIcon />
                </Show>
            </Button>

            <Show when={open()}>
                <VerifiedSelector />
                <FormatSelector />
            </Show>
        </>
    );
}
