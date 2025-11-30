import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { MusicIdWithCreator } from "~/server/db/schema/music";
import { FormattedId } from "./formatted-id";

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
