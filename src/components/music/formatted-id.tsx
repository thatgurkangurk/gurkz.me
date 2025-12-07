import { useAtomValue } from "jotai";
import { type IdFormat, idFormat } from "./format";
import { CopyButton } from "../ui/shadcn-io/copy-button";

function formatId(robloxId: string, format: IdFormat) {
	switch (format) {
		case "DEFAULT": {
			return robloxId;
		}
		case "TRAITOR_TOWN": {
			return `s/${robloxId}`;
		}
		default: {
			return robloxId;
		}
	}
}

export function FormattedId(
	props: Readonly<{
		robloxId: string;
	}>,
) {
	const format = useAtomValue(idFormat);

	return (
		<>
			<span>{formatId(props.robloxId, format)}</span>
			<CopyButton
				variant={"outline"}
				content={formatId(props.robloxId, format)}
				delay={500}
			/>
		</>
	);
}
