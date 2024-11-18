import { MetaProvider, Title } from "@solidjs/meta";
import { Show, Suspense, type ParentProps } from "solid-js";
import { Nav } from "./nav";
import { SessionProvider } from "@solid-mediakit/auth/client";

export function Layout(props: ParentProps) {
  return (
    <MetaProvider>
      <Title>gurkan's website</Title>
      <Suspense>
        <SessionProvider>
          <Show when={process.env.IS_PREVIEW === "1"}>
            <div class="w-full text-white bg-orange-500">
              <p>
                this is a preview deployment - go to the main deployment{" "}
                <a
                  class="underline underline-offset-4"
                  href="https://www.gurkz.me/"
                >
                  here
                </a>
              </p>
            </div>
          </Show>
          <nav class="flex flex-row gap-2">
            <Nav
              links={[
                {
                  href: "/",
                  text: "home",
                },
                {
                  href: "/music",
                  text: "music id list",
                },
              ]}
            />
          </nav>
          <main>{props.children}</main>
        </SessionProvider>
      </Suspense>
    </MetaProvider>
  );
}
