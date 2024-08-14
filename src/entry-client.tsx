// @refresh reload
import { StartClient, mount } from "@solidjs/start/client";

// biome-ignore lint/style/noNonNullAssertion: this cannot be done in another way afaik
mount(() => <StartClient />, document.getElementById("app")!);
