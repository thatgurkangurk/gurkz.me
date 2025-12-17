import { Link, type ValidateRedirectOptions } from "@tanstack/react-router";

type MobileNavLinkProps = {
  label: string;
  to: ValidateRedirectOptions["to"];
  onClick?: () => void;
};

export function MobileNavLink({
  label,
  to,
  onClick,
}: Readonly<MobileNavLinkProps>) {
  return (
    <Link
      to={to}
      onClick={onClick}
      activeProps={{
        className: "text-primary font-medium",
      }}
      inactiveProps={{
        className:
          "text-gray-700 hover:text-black dark:text-white/90 dark:hover:text-white",
      }}
      className="hover:bg-gray-100 dark:hover:bg-white/5 transition-colors px-6 py-3 text-base font-medium"
    >
      {label}
    </Link>
  );
}
