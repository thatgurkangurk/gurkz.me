import { ParentProps } from "solid-js";
import { Title as MTitle } from "@solidjs/meta";

export function Title(props: ParentProps) {
  return <MTitle>{props.children} - gurkan's website</MTitle>;
}
