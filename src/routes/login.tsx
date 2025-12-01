import { createFileRoute, redirect } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { SquareUserRound } from "lucide-react";
import * as z from "zod/v4";
import { SignInDialogContent } from "~/components/auth-status";
import { Button } from "~/components/ui/button";
import { Dialog, DialogTrigger } from "~/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { getServerSession } from "~/lib/session";

const loginSearchSchema = z.object({
  redirectTo: z.optional(z.string()).default("/"),
});

export const Route = createFileRoute("/login")({
  component: RouteComponent,
  validateSearch: zodValidator(loginSearchSchema),
  beforeLoad: async ({ search }) => {
    const session = await getServerSession();

    if (session)
      throw redirect({
        to: search.redirectTo,
      });
  },
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
          <Dialog>
            <DialogTrigger asChild>
              <Button>sign in</Button>
            </DialogTrigger>
            <SignInDialogContent />
          </Dialog>
        </div>
      </EmptyContent>
    </Empty>
  );
}
