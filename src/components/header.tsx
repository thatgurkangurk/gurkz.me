import { Link } from "@tanstack/react-router";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
  return (
    <header className="border-b-2 p-2 flex gap-2 justify-between">
      <nav className="items-center flex flex-row w-full">
        <div className="px-2 font-bold">
          <Link to="/">home</Link>
        </div>

        <div className="ml-auto">
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
