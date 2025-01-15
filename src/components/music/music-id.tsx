import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { FormattedId } from "./_FormattedId";
import { actions } from "astro:actions";
import { useSession } from "~/lib/auth/client";
import { queryClient } from "~/lib/queryClient";
import type { MusicId } from "~/pages/music/_types";

function DeleteButton(props: { musicId: MusicId }) {
    const session = useSession();

    const canDelete = () => {
        const user = session().data?.user;
        if (!user) return false;

        return (
            user.permissions.includes("MANAGE_MUSIC_IDS") ||
            user.id === props.musicId.creator.id
        );
    };

    return (
        <>
            {canDelete() && (
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        const { error } = await actions.music.deleteMusicId(
                            new FormData(e.currentTarget)
                        );
                        if (error) {
                            alert(`could not delete: ${error.message}`);
                            console.error(`could not delete: ${error.message}`);
                            return;
                        }

                        queryClient.refetchQueries({
                            queryKey: ["music", "getMusicIds"],
                        });
                    }}
                    method="post"
                    action={actions.music.deleteMusicId}
                >
                    <input name="id" type="hidden" value={props.musicId.id} />
                    <Button class="w-fit" variant={"destructive"} type="submit">
                        delete
                    </Button>
                </form>
            )}
        </>
    );
}

export function MusicId(props: { musicId: MusicId }) {
    return (
        <Card class="w-full h-full">
            <CardHeader>
                <CardTitle class="text-xl">{props.musicId.name}</CardTitle>
            </CardHeader>
            <CardContent class="flex items-center text-xl">
                <FormattedId id={props.musicId.robloxId} />
            </CardContent>
            <CardFooter class="grid gap-1 grid-cols-1">
                <p>created by {props.musicId.creator.name}</p>

                <DeleteButton musicId={props.musicId} />
            </CardFooter>
        </Card>
    );
}
