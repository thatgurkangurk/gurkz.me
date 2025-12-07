import { useAtom, useAtomValue } from "jotai";
import { type IdFormat, idFormat } from "./format";
import { Button } from "../ui/button";
import React from "react";

function SelectorButton(
	props: Readonly<{
		newFormat: IdFormat;
		label: React.ReactNode;
	}>,
) {
	const [format, setFormat] = useAtom(idFormat);

	return (
		<Button
			disabled={format === props.newFormat}
			onClick={() => setFormat(props.newFormat)}
		>
			{props.label}
		</Button>
	);
}

export function FormatSelector() {
	const format = useAtomValue(idFormat);
	return (
		<>
			<p>current format: {format}</p>
			<div className="flex flex-row gap-2 select-none">
				<SelectorButton label={"default"} newFormat={"DEFAULT"} />
				<SelectorButton label={"traitor town"} newFormat={"TRAITOR_TOWN"} />
			</div>
		</>
	);
}
