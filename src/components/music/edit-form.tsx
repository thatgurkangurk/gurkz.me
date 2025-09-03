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
import { MusicIdWithCreator, UpdateMusicIdInput } from "@/lib/schemas/music";
import { useCallback, useMemo, useState } from "react";
import { useAppForm } from "@/components/ui/tanstack-form";
import { LoaderCircle, Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { useStore } from "@tanstack/react-form";
import { useSession } from "@/hooks/useSession";
import { Input } from "../ui/input";
import { Switch } from "@/components/ui/switch";
import { deepEqual } from "@tanstack/react-router";

export function EditMusicIdForm({ musicId }: { musicId: MusicIdWithCreator }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>edit</Button>
      </DialogTrigger>
      <DialogContent>
        <InnerForm onSuccess={() => setOpen(false)} musicId={musicId} />
      </DialogContent>
      <DialogDescription className="sr-only">
        form to edit a music id
      </DialogDescription>
    </Dialog>
  );
}

function InnerForm({
  musicId,
  onSuccess,
}: {
  musicId: MusicIdWithCreator;
  onSuccess: () => void;
}) {
  const { data: user } = useSession();
  const { mutateAsync, isPending } = useMutation(
    orpc.music.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.refetchQueries({
          queryKey: orpc.music.get.queryKey(),
        });
        form.reset();
        onSuccess();
      },
    })
  );
  const queryClient = useQueryClient();
  const form = useAppForm({
    defaultValues: {
      ...musicId,
    } as UpdateMusicIdInput,
    validators: {
      onChange: UpdateMusicIdInput,
    },
  });
  const values = useStore(form.store, (state) => state.values);

  const hasChanges = useMemo(() => {
    return !deepEqual(values, musicId);
  }, [values]);

  const handleSave = useCallback(() => {
    const promise = mutateAsync({ ...form.state.values, id: musicId.id });
    toast.promise(promise, {
      loading: "saving...",
      success: `successfully saved "${musicId.name}"`,
      error: "something went wrong",
    });
  }, [form, mutateAsync, musicId]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>editing "{musicId.name}"</DialogTitle>
      </DialogHeader>
      <div className="flex items-center gap-2">
        <form.AppForm>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            method="post"
            encType={"multipart/form-data"}
          >
            <div className="space-y-4">
              <form.AppField
                name="name"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>display name</field.FormLabel>
                    <field.FormControl>
                      <Input
                        aria-invalid={!field.state.meta.isValid}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
              <form.AppField
                name="robloxId"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>roblox id</field.FormLabel>
                    <field.FormControl>
                      <Input
                        aria-invalid={!field.state.meta.isValid}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
              <form.AppField name="tags" mode="array">
                {(field) => {
                  return (
                    <div>
                      {field.state.value?.map((_, i) => {
                        return (
                          <form.AppField
                            key={i}
                            name={`tags[${i}]`}
                            children={(subField) => (
                              <div className="flex w-full max-w-sm items-center gap-2">
                                <subField.FormItem>
                                  <subField.FormLabel>
                                    tag {i + 1}
                                  </subField.FormLabel>
                                  <div className="flex w-full max-w-sm items-center gap-2">
                                    <subField.FormControl className="flex-1">
                                      <Input
                                        aria-invalid={
                                          !subField.state.meta.isValid
                                        }
                                        name={subField.name}
                                        value={subField.state.value}
                                        onChange={(e) =>
                                          subField.handleChange(e.target.value)
                                        }
                                        onBlur={subField.handleBlur}
                                      />
                                    </subField.FormControl>

                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      onClick={() => field.removeValue(i)}
                                    >
                                      <Trash />
                                    </Button>
                                  </div>
                                  <subField.FormMessage />
                                </subField.FormItem>
                              </div>
                            )}
                          />
                        );
                      })}
                      <Button
                        disabled={(field.state.value?.length ?? 0) > 3}
                        onClick={() => field.pushValue("")}
                        type="button"
                        className="my-2"
                        variant={"secondary"}
                      >
                        {(field.state.value?.length ?? 0) > 3
                          ? "max tags reached"
                          : "add tag"}
                      </Button>
                    </div>
                  );
                }}
              </form.AppField>

              <form.AppField
                name="working"
                children={(field) => (
                  <>
                    <field.FormItem>
                      <field.FormLabel>working</field.FormLabel>
                      <field.FormControl>
                        <Switch
                          aria-invalid={!field.state.meta.isValid}
                          name={field.name}
                          checked={field.state.value}
                          onCheckedChange={(value) => field.handleChange(value)}
                          onBlur={field.handleBlur}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  </>
                )}
              />

              {user?.user.permissions.includes("MANAGE_MUSIC_IDS") && (
                <form.AppField name="verified">
                  {(field) => (
                    <field.FormItem>
                      <field.FormLabel>verified</field.FormLabel>
                      <field.FormControl>
                        <Switch
                          aria-invalid={!field.state.meta.isValid}
                          name={field.name}
                          checked={field.state.value}
                          onCheckedChange={(value) => field.handleChange(value)}
                          onBlur={field.handleBlur}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                </form.AppField>
              )}
            </div>
          </form>
        </form.AppForm>
      </div>

      <DialogFooter className="grid grid-cols-2">
        <Button disabled={isPending || !hasChanges} onClick={handleSave}>
          {isPending && <LoaderCircle className="animate-spin" />} save
        </Button>
        <DialogClose asChild>
          <Button disabled={isPending} type="button" variant="secondary">
            cancel
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}
