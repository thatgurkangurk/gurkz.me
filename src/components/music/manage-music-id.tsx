import { MusicIdWithCreator } from "@/lib/schemas/music";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

function Delete({ musicId }: { musicId: MusicIdWithCreator }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation(
    orpc.music.delete.mutationOptions({
      onSuccess: async () => {
        setOpen(false);
        await queryClient.refetchQueries({
          queryKey: orpc.music.get.queryKey(),
        });
      },
    })
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            are you sure you want to delete "{musicId.name}"?
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
                id: musicId.id,
              });
              toast.promise(promise, {
                loading: "deleting...",
                success: `successfully deleted "${musicId.name}"`,
                error: "something went wrong",
              });
            }}
          >
            {isPending && <LoaderCircle className="animate-spin" />}
            yes
          </Button>
          <DialogClose asChild>
            <Button type="button" variant={"secondary"}>
              no, cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ManageMusicId({ musicId }: { musicId: MusicIdWithCreator }) {
  return (
    <div>
      <Delete musicId={musicId} />
    </div>
  );
}
