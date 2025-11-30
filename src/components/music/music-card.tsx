import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { MusicIdWithCreator } from "~/server/db/schema/music";
import { CopyButton } from "../ui/shadcn-io/copy-button";

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
          <CopyButton
            variant={"outline"}
            content={`s/${props.musicId.robloxId}`}
            delay={500}
          />
        </div>
      </CardContent>
    </Card>
  );
}
