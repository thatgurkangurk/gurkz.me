import { OctagonAlert } from "lucide-solid";
import { type Accessor, type Setter, onMount } from "solid-js";
import type { IdFormat } from "~/lib/music/id-format";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export function IdFormatToggle(props: {
	idFormat: Accessor<IdFormat>;
	setIdFormat: Setter<IdFormat>;
}) {
	onMount(() => {
		console.log(props.idFormat());
	});

	return (
		<div class="text-center pt-3 gap-2">
			<ToggleGroup
				value={props.idFormat()}
				onChange={(value) => {
					props.setIdFormat((value as IdFormat) ?? props.idFormat());
				}}
			>
				<ToggleGroupItem value="NORMAL" aria-label="normal">
					Normal
				</ToggleGroupItem>
				<ToggleGroupItem value="TRAITOR_TOWN" aria-label="traitor town">
					Traitor Town
				</ToggleGroupItem>
			</ToggleGroup>

			{props.idFormat() === "TRAITOR_TOWN" && (
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
