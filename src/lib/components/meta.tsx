import { Title as MTitle } from "@solidjs/meta";
import type { ParentProps } from "solid-js";

export function Title(props: ParentProps) {
	return <MTitle>{props.children} - gurkan's website</MTitle>;
}
