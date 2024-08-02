import { Button } from "./ui/button";
import { Check, Clipboard } from "lucide-solid";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { createSignal, Match, Switch } from "solid-js";

type CopyButtonProps = {
	/** the text to copy */
	content: string;
};

export function CopyButton(props: CopyButtonProps) {
	const [state, setState] = createSignal<"idle" | "copied">("idle");

	return (
		<Tooltip>
			<TooltipContent>
				<Switch>
					<Match when={state() === "idle"}>
						<p>copy to clipboard</p>
					</Match>
					<Match when={state() === "copied"}>
						<p>copied</p>
					</Match>
				</Switch>
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
					<Switch>
						<Match when={state() === "idle"}>
							<Clipboard class="h-6 w-6" />
						</Match>
						<Match when={state() === "copied"}>
							<Check class="h-6 w-6" />
						</Match>
					</Switch>
				</Button>
			</TooltipTrigger>
		</Tooltip>
	);
}
