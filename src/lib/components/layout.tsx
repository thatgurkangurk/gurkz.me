import { ColorModeProvider, ColorModeScript } from "@kobalte/core";
import { MetaProvider } from "@solidjs/meta";
import { type ParentProps, Suspense } from "solid-js";
import { Nav } from "./Nav";

export function Layout(props: ParentProps) {
	return (
		<MetaProvider>
			<div class="min-h-[100dvh] w-full flex flex-col">
				<ColorModeProvider>
					<Nav />
					<Suspense>
						<ColorModeScript initialColorMode="dark" />
						<main class="p-2 flex-grow">{props.children}</main>
					</Suspense>
				</ColorModeProvider>
			</div>
		</MetaProvider>
	);
}
