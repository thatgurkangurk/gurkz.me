import { TOOLS_MAP, type Tool, type ToolSlug } from "@/lib/tools";
import { ReactNode } from "react";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

type ToolLayoutProps =
  | {
      tool: ToolSlug;
      children: (tool: Tool) => ReactNode;
    }
  | {
      tool: ToolSlug;
      children: ReactNode;
    };

export function ToolLayout({ children, tool }: ToolLayoutProps) {
  if (typeof children === "function") {
    return (
      <>
        <Button asChild>
          <Link to="/tools">
            <ArrowLeft /> back
          </Link>
        </Button>
        {(children as (tool: Tool) => ReactNode)(TOOLS_MAP[tool])}
      </>
    );
  }
  return (
    <>
      <Button asChild>
        <Link to="/tools">
          <ArrowLeft /> back
        </Link>
      </Button>
      {children}
    </>
  );
}
