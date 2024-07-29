import { Title } from "@solidjs/meta";
import { createAsync } from "@solidjs/router";
import { Show } from "solid-js";
import { Auth } from "~/lib/components/auth";
import { getMessage } from "~/message";

export default function Home() {
	const message = createAsync(() => getMessage());
	return (
		<main>
			<Title>hai</Title>
			<h1>hello!</h1>
			<p>i'm remaking my website again cuz why not i like solidjs better so</p>
			<Show when={message()} fallback={<span>no message</span>}>
				{message()}
			</Show>
			<Auth />
			<p>
				if you want to, you can check out the progress{" "}
				<a href="https://github.com/thatgurkangurk/gurkz.me/pull/38">here</a>
			</p>
		</main>
	);
}
