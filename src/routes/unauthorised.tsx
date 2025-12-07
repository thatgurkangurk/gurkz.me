import { createFileRoute, Link } from "@tanstack/react-router";
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

const unauthorisedSearchSchema = z.object({
	redirectTo: z.string(),
});

export const Route = createFileRoute("/unauthorised")({
	component: RouteComponent,
	validateSearch: zodValidator(unauthorisedSearchSchema),
});

function RouteComponent() {
	const searchParams = Route.useSearch();
	return (
		<Empty className="h-full bg-linear-to-b from-muted/50 from-30% to-background">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<SquareUserRound />
				</EmptyMedia>
				<EmptyTitle>error 403</EmptyTitle>
				<EmptyDescription>
					you do not have permission to access "{searchParams.redirectTo}"
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<div className="flex gap-2">
					<Button asChild>
						<Link to="/">go home</Link>
					</Button>
					<Button asChild>
						<Link to={searchParams.redirectTo}>try again</Link>
					</Button>
				</div>
			</EmptyContent>
		</Empty>
	);
}
