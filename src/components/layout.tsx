import { ParentComponent } from "solid-js";
import { Link, Navbar } from "./navbar";
import { ModeToggle } from "./ui/theme-toggle";

const Layout: ParentComponent = (props) => {
  return (
    <main class="[grid-area:main]">
      <ModeToggle />
      <Navbar>
        <Link href="/">home</Link>
      </Navbar>
      {props.children}
    </main>
  );
};

export { Layout };
