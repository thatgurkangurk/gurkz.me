import { As, useColorMode } from "@kobalte/core";
import { FaRegularMoon, FaRegularSun } from "solid-icons/fa";
import { TbDeviceLaptop } from "solid-icons/tb";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function ModeToggle() {
  const { toggleColorMode, colorMode } = useColorMode();
  console.log(colorMode());

  return (
    <>
      <Button
        onClick={() => {
          toggleColorMode();
        }}
        variant="ghost"
        size="icon"
        class="w-9 text-xl px-0"
      >
        <FaRegularMoon class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <FaRegularSun class="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </>
  );
}