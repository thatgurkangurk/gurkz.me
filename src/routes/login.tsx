import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { SquareUserRound } from "lucide-react";
import * as z from "zod/v4";
import { Button } from "~/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { authClient } from "~/lib/auth";

const loginSearchSchema = z.object({
  redirectTo: z.optional(z.string()).default("/"),
});

export const Route = createFileRoute("/login")({
  component: RouteComponent,
  validateSearch: zodValidator(loginSearchSchema),
});

function RouteComponent() {
  const searchParams = Route.useSearch();
  return (
    <Empty className="h-full bg-linear-to-b from-muted/50 from-30% to-background">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SquareUserRound />
        </EmptyMedia>
        <EmptyTitle>please sign in</EmptyTitle>
        <EmptyDescription>
          Please sign in to access "{searchParams.redirectTo}"
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button
            onClick={() =>
              authClient.signIn.social({
                provider: "discord",
                callbackURL: searchParams.redirectTo,
              })
            }
          >
            sign in
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
