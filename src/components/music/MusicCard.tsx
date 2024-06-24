import type { musicIds } from "@/lib/schema/music";
import type { InferSelectModel } from "drizzle-orm";
import type { User } from "lucia";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

type MusicId = InferSelectModel<typeof musicIds> & {
  creator: User;
};

export function MusicCard(props: { musicId: MusicId }) {
  return (
    <Card class="w-full h-full">
      <CardHeader>
        <CardTitle class="text-xl">{props.musicId.name}</CardTitle>
      </CardHeader>
      <CardContent class="flex items-center text-xl">
        <span>{props.musicId.robloxId}</span>
      </CardContent>
      <CardFooter class="grid grid-cols-1">
        <span>created by: {props.musicId.creator.username}</span>
      </CardFooter>
    </Card>
  );
}
