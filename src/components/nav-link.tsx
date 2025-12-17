import { Link, type ValidateRedirectOptions } from "@tanstack/react-router";

type NavLinkProps = {
  label: string;
  to: ValidateRedirectOptions["to"];
};

export function NavLink({ label, to }: Readonly<NavLinkProps>) {
  return (
    <Link
      to={to}
      activeProps={{
        className: "text-primary font-medium",
      }}
      inactiveProps={{
        className:
          "text-gray-700 hover:text-black dark:text-white/90 dark:hover:text-white",
      }}
    >
      {label}
    </Link>
  );
}
