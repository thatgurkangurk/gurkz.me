import { A, useLocation } from "@solidjs/router";
import {
  Component,
  For,
  JSXElement,
  ParentComponent,
  children,
} from "solid-js";

type Link = {
  children: JSXElement;
  href: string;
};

const Navbar: ParentComponent = (props) => {
  const location = useLocation();
  const links = children(() => props.children);
  const evaluatedLinks = () => links.toArray() as unknown as Link[];

  console.log(location.pathname);

  return (
    <header class="text-center">
      <h2>gurkan's website</h2>
      <ul class="flex flex-row justify-center gap-2">
        <For each={evaluatedLinks()}>
          {({ children, href }) => (
            <li>
              <A
                href={href}
                class={`mt-[8px] ${
                  href === location.pathname ? "text-themeColor underline" : ""
                }`}
              >
                {children}
              </A>
            </li>
          )}
        </For>
      </ul>
    </header>
  );
};

const Link: Component<Link> = (props) => {
  return props as unknown as JSXElement;
};

export { Navbar, Link };
