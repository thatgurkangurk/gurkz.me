import { MetaProvider, Title } from "@solidjs/meta";
import type { ParentProps } from "solid-js";

export function Layout(props: ParentProps) {
  return (
    <MetaProvider>
      <Title>gurkan's website</Title>
      <main>{props.children}</main>
    </MetaProvider>
  );
}
