import { MusicIdWithCreator } from "@/lib/schemas/music";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormattedId } from "./formatted-id";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { hasPermission } from "@/lib/permissions";
import { lazy, Suspense } from "react";

const ManageMusicId = lazy(() =>
  import("./manage-music-id").then((module) => ({
    default: module.ManageMusicId,
  }))
);

export function MusicCard({ musicId }: { musicId: MusicIdWithCreator }) {
  const { data: session } = useQuery(orpc.session.get.queryOptions());
  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle className="text-xl">{musicId.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-xl">
          <FormattedId robloxId={musicId.robloxId} />
        </div>

        {musicId.tags && musicId.tags.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {musicId.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-1">
        <p>
          created by <span>{musicId.creator.name}</span>
        </p>
        {session?.user &&
          (session.user.id === musicId.createdById ||
            hasPermission(session.user, "MANAGE_MUSIC_IDS")) && (
            <Suspense>
              <ManageMusicId musicId={musicId} />
            </Suspense>
          )}
      </CardFooter>
    </Card>
  );
}
