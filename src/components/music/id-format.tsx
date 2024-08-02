import { idFormat, setIdFormat, type IdFormat } from "~/lib/music/id-format";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export function IdFormatToggle() {
	return (
		<div class="text-center pt-3 grid gap-2">
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
		</div>
	);
}
