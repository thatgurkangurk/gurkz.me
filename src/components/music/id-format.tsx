import { idFormat, setIdFormat, type IdFormat } from "~/lib/music/id-format";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Show } from "solid-js";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { OctagonAlert } from "lucide-solid";

export function IdFormatToggle() {
	return (
		<div class="text-center pt-3 gap-2">
			<ToggleGroup
				value={idFormat()}
				onChange={(value) => {
					setIdFormat((value as IdFormat) ?? idFormat());
				}}
			>
				<ToggleGroupItem value="NORMAL" aria-label="normal">
					Normal
				</ToggleGroupItem>
				<ToggleGroupItem value="TRAITOR_TOWN" aria-label="traitor town">
					Traitor Town
				</ToggleGroupItem>
			</ToggleGroup>

			<Show when={idFormat() === "TRAITOR_TOWN"}>
				<div class="text-left w-fit pt-2">
					<Alert variant={"destructive"}>
						<OctagonAlert class="h-4 w-4" />
						<AlertTitle>warning</AlertTitle>
						<AlertDescription>
							make sure that you own the sound player gamepass
						</AlertDescription>
					</Alert>
				</div>
			</Show>
		</div>
	);
}
