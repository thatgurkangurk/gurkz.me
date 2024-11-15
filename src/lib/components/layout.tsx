import { MetaProvider, Title } from "@solidjs/meta";
import type { ParentProps } from "solid-js";
import { Nav } from "./nav";

export function Layout(props: ParentProps) {
  return (
    <MetaProvider>
      <Title>gurkan's website</Title>
      <nav class="flex flex-row gap-2">
        <Nav links={[
          {
            href: "/",
            text: "home"
          },
          {
            href: "/music",
            text: "music id list"
          }
        ]} />
      </nav>
      <main>{props.children}</main>
    </MetaProvider>
  );
}
