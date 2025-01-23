import { Title as SolidTitle } from "@solidjs/meta";
import { ParentProps } from "solid-js";

export function Title(props: ParentProps) {
    return <SolidTitle>{props.children} - gurkan's website</SolidTitle>;
}
