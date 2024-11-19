import { useAuth } from "@solid-mediakit/auth/client";
import { For, Show } from "solid-js";

type Link = {
  text: string;
  href: string;
};

function NavLink(props: Link) {
  return <a href={props.href}>{props.text}</a>;
}

export function Nav(props: { links: Link[] }) {
  const auth = useAuth();
  return (
    <div class="flex flex-row gap-2 w-full">
      <For each={props.links}>{(link) => <NavLink {...link} />}</For>
      <div class="ml-auto flex-1 sm:flex-initial" />
      <div class="flex flex-row items-center break-normal gap-2">
        <Show
          when={auth.session()}
          fallback={
            <button onClick={() => auth.signIn("discord")}>sign in</button>
          }
        >
          {(session) => (
            <div class="flex gap-2">
              <p>hello, {session().user.name}</p>
              <button onClick={() => auth.signOut()}>sign out</button>
            </div>
          )}
        </Show>
      </div>
    </div>
  );
}
