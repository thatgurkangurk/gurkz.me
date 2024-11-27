import { useAuth } from "@solid-mediakit/auth/client";
import { deleteMusicId, getMusicIds, type MusicId } from "~/lib/music";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Show } from "solid-js";
import { Button } from "../ui/button";

export function MusicCard(props: { musicId: MusicId }) {
  const auth = useAuth();
  const musicIdsUtils = getMusicIds.useUtils();
  const { mutate } = deleteMusicId(() => ({
    async onSettled() {
      await musicIdsUtils.invalidate();
    },
  }));

  return (
    <Card class="w-full h-full">
      <CardHeader>
        <CardTitle class="text-xl">{props.musicId.name}</CardTitle>
      </CardHeader>
      <CardContent class="flex items-center text-xl">
        <span>{props.musicId.robloxId}</span>
      </CardContent>
      <CardFooter class="grid gap-1 grid-cols-1">
        <p>created by {props.musicId.creator.name}</p>
        <Show when={auth.session()}>
          {(session) => (
            <>
              <Show
                when={
                  session().user.id === props.musicId.createdById ||
                  session().user.permissions.includes("MANAGE_MUSIC_IDS")
                }
              >
                <Button
                  onClick={() =>
                    mutate({
                      id: props.musicId.id,
                    })
                  }
                  class="w-fit"
                  variant={"destructive"}
                >
                  delete
                </Button>
              </Show>
            </>
          )}
        </Show>
      </CardFooter>
    </Card>
  );
}
