import { useColorMode } from "@kobalte/core";
import { FaRegularMoon, FaRegularSun } from "solid-icons/fa";
import { Button } from "~/components/ui/button";

export function ModeToggle() {
	const { toggleColorMode } = useColorMode();

	return (
		<>
			<Button
				onClick={() => {
					toggleColorMode();
				}}
				variant="ghost"
				size="icon"
				class="w-9 px-0 text-xl"
			>
				<FaRegularMoon class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
				<FaRegularSun class="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
				<span class="sr-only">Toggle theme</span>
			</Button>
		</>
	);
}
