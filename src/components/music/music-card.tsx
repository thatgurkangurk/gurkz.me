import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { MusicIdWithCreator } from "~/server/db/schema/music";
import { FormattedId } from "./formatted-id";
import { DeleteMusicId } from "./delete-music-id";
import { Check } from "~/lib/permix";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "long",
});

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
      <CardFooter className="grid grid-cols-1 gap-1">
        <div className="flex flex-row gap-2">
          <Check entity={"musicId"} action={"delete"} data={props.musicId}>
            <DeleteMusicId musicId={props.musicId} />
          </Check>
        </div>
        <p>
          created by <span>{props.musicId.creator.name}</span> on{" "}
          <span className="whitespace-nowrap">
            {dateFormat.format(props.musicId.created)}
          </span>
        </p>
      </CardFooter>
    </Card>
  );
}
