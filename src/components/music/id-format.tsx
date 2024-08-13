import { OctagonAlert } from "lucide-solid";
import { Show, onMount } from "solid-js";
import { type IdFormat, idFormat, setIdFormat } from "~/lib/music/id-format";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export function IdFormatToggle() {
	onMount(() => {
		console.log(idFormat());
	});

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

			{idFormat() === "TRAITOR_TOWN" && (
				<div class="text-left w-fit pt-2">
					<Alert variant={"destructive"}>
						<OctagonAlert class="h-4 w-4" />
						<AlertTitle>warning</AlertTitle>
						<AlertDescription>
							make sure that you own the sound player gamepass
						</AlertDescription>
					</Alert>
				</div>
			)}
		</div>
	);
}
