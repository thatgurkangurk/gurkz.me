import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { MusicIdWithCreator } from "~/server/db/schema/music";

export function MusicCard(
  props: Readonly<{
    musicId: MusicIdWithCreator;
  }>
) {
  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle className="text-xl">{props.musicId.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 text-xl">
          <span>s/{props.musicId.robloxId}</span>
        </div>
      </CardContent>
    </Card>
  );
}
