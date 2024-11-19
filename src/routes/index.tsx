import { useAuth } from "@solid-mediakit/auth/client";
import { Show } from "solid-js";

export default function Home() {
  const auth = useAuth();
  return (
    <div>
      <p>hello, world</p>
    </div>
  );
}
