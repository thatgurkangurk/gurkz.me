import { ParentComponent } from "solid-js";
import { Link, Navbar } from "./navbar";
import { ModeToggle } from "./ui/theme-toggle";
import { Footer } from "./footer";

const Layout: ParentComponent = (props) => {
  return (
    <>
      <main class="[grid-area:main]">
        <ModeToggle />
        <Navbar>
          <Link href="/">home</Link>
          <Link href="/projects">projects</Link>
        </Navbar>
        {props.children}
      </main>
      <Footer />
    </>
  );
};

export { Layout };
