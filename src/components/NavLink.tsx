import { mergeProps, type JSXElement } from "solid-js";

type NavLinkProps = {
  href: string;
  alwaysActive: boolean | undefined;
  onClick?: () => void;
  currentPathname: string;
  children: JSXElement;
};

function NavLink(props: NavLinkProps) {
  const merged = mergeProps(
    { alwaysActive: false, onClick: () => null },
    props
  );
  const isActive =
    merged.currentPathname === merged.href || merged.alwaysActive;

  return (
    <a
      onClick={() => merged.onClick()}
      href={merged.href}
      class={`flex items-center gap-2 font-semibold ${
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      } ${merged.alwaysActive ? "text-lg" : ""}`}
    >
      {merged.children}
    </a>
  );
}

export { NavLink };
