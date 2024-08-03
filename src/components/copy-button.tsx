import { Button } from "./ui/button";
import { Check, Clipboard } from "lucide-solid";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { createSignal, Show } from "solid-js";

type CopyButtonProps = {
	/** the text to copy */
	content: string;
};

export function CopyButton(props: CopyButtonProps) {
	const [state, setState] = createSignal<"idle" | "copied">("idle");

	return (
		<Tooltip>
			<TooltipContent>
				<Show when={state() === "copied"} fallback={<p>copy to clipboard</p>}>
					<p>copied</p>
				</Show>
			</TooltipContent>
			<TooltipTrigger>
				<Button
					onClick={() => {
						setState(() => "copied");
						navigator.clipboard.writeText(props.content.toString());
						setTimeout(() => {
							setState(() => "idle");
						}, 1000);
					}}
					variant={"ghost"}
				>
					<Show
						when={state() === "copied"}
						fallback={<Clipboard class="h-6 w-6" />}
					>
						<Check class="h-6 w-6" />
					</Show>
				</Button>
			</TooltipTrigger>
		</Tooltip>
	);
}
