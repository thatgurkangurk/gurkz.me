import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { writeClipboard } from "@solid-primitives/clipboard";
import CheckIcon from "lucide-solid/icons/check";
import ClipboardIcon from "lucide-solid/icons/clipboard";
import { createSignal, Match, Switch } from "solid-js";

function CopyButton(props: { content: string }) {
    const [status, setStatus] = createSignal<"IDLE" | "COPIED">("IDLE");
    const [open, setOpen] = createSignal<boolean>(false);
    return (
        <>
            <Tooltip
                openDelay={50}
                closeDelay={100}
                placement={"top"}
                open={open()}
                onOpenChange={setOpen}
            >
                <TooltipTrigger
                    as={Button}
                    size={"icon"}
                    variant={"outline"}
                    onClick={() => {
                        writeClipboard(props.content.toString()).then(() => {
                            setStatus("COPIED");
                            setOpen(true);

                            setTimeout(() => {
                                setStatus("IDLE");
                                setOpen(false);
                            }, 2000);
                        });
                    }}
                >
                    <Switch>
                        <Match when={status() === "IDLE"}>
                            <ClipboardIcon />
                        </Match>
                        <Match when={status() === "COPIED"}>
                            <CheckIcon />
                        </Match>
                    </Switch>
                </TooltipTrigger>
                <TooltipContent>
                    <Switch>
                        <Match when={status() === "IDLE"}>
                            <>copy</>
                        </Match>
                        <Match when={status() === "COPIED"}>
                            <>copied!</>
                        </Match>
                    </Switch>
                </TooltipContent>
            </Tooltip>
        </>
    );
}

export { CopyButton };
