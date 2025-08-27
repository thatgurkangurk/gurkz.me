import { Link } from "@tanstack/react-router";
import { ModeToggle } from "./mode-toggle";
import { AuthStatus } from "./auth-status";

export default function Header() {
  return (
    <header className="border-b-2 p-2 flex gap-2 justify-between">
      <nav className="items-center flex flex-row w-full">
        <div className="px-2 font-bold">
          <Link to="/">home</Link>
        </div>
        <div className="px-2 font-bold">
          <Link to="/music">music id list</Link>
        </div>

        <div className="ml-auto flex flex-row gap-2 items-center">
          <AuthStatus />
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
