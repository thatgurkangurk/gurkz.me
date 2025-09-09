import { Route } from "next";
import Link from "next/link";

type NavLink = {
  label: string;
  to: Route;
};

export function Header({ links }: { links: NavLink[] }) {
  return (
    <nav className="flex flex-row gap-2">
      <p>gurkan&apos;s website</p>
      {links.map((link, index) => (
        <Link href={link.to} key={index}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
