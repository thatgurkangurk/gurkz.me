import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <div className="pt-2">
      <footer className="border-t border-border/30 bg-background mt-auto">
        <div className="container flex items-center justify-center py-4 text-sm text-muted-foreground/70">
          <Link
            to="/privacy"
            className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
          >
            privacy
          </Link>
        </div>
      </footer>
    </div>
  );
}
