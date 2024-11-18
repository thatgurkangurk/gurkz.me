import { useAuth } from "@solid-mediakit/auth/client";
import { Show } from "solid-js";

export default function Home() {
  const auth = useAuth();
  return (
    <div>
      <p>hello, world</p>
      <div>
        <Show
          when={auth.session()}
          fallback={
            <>
              <button onClick={() => auth.signIn("discord")}>sign in</button>
            </>
          }
        >
          <p>hello, {auth.session()?.user?.name}</p>
          <button onClick={() => auth.signOut()}>log out</button>
        </Show>
      </div>
    </div>
  );
}
