import { useMutation } from "@tanstack/react-query";
import { orpc } from "~/lib/orpc";
import { MusicIdWithCreator } from "~/server/db/schema/music";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

export function DeleteMusicId(
  props: Readonly<{
    musicId: MusicIdWithCreator;
  }>
) {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useMutation(
    orpc.music.delete.mutationOptions({
      onSuccess: async (_data, _variables, _result, { client }) => {
        await client.invalidateQueries({
          queryKey: orpc.music.list.queryKey(),
        });
      },
    })
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"destructive"} className="w-fit">
          delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            are you sure you want to delete "{props.musicId.name}"?
          </DialogTitle>
          <DialogDescription>
            this cannot be undone. this will permanently delete this music id,
            and it cannot be recovered.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-2">
          <Button
            disabled={isPending}
            type="button"
            variant={"destructive"}
            onClick={() => {
              const promise = mutateAsync({
                id: props.musicId.id,
              });
              toast.promise(promise, {
                loading: "deleting...",
                success: () => {
                  setOpen(false);
                  return `successfully deleted "${props.musicId.name}"`;
                },
                position: "top-center",
                error: "something went wrong",
              });
            }}
          >
            {isPending && <LoaderCircle className="animate-spin" />}
            delete
          </Button>
          <DialogClose asChild>
            <Button variant={"outline"}>cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
