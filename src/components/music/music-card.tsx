import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { MusicIdWithCreator } from "~/server/db/schema/music";
import { FormattedId } from "./formatted-id";

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
          <FormattedId robloxId={props.musicId.robloxId} />
        </div>
      </CardContent>
    </Card>
  );
}
