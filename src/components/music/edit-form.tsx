import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MusicIdWithCreator, UpdateMusicIdInput } from "@/lib/schemas/music";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useAppForm } from "./form/hooks";
import { FieldInfo } from "../form/field-info";
import { LoaderCircle, Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { useStore } from "@tanstack/react-form";
import { useSession } from "@/hooks/useSession";

function FormWrapper({
  children,
  open,
  setOpen,
}: {
  children: ReactNode;
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>edit</Button>
      </DialogTrigger>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, i) => deepEqual(val, b[i]));
  }

  if (a && b && typeof a === "object") {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) => deepEqual(a[key], b[key]));
  }

  return false;
}

export function EditMusicIdForm({ musicId }: { musicId: MusicIdWithCreator }) {
  const { data: user } = useSession();
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useMutation(
    orpc.music.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.refetchQueries({
          queryKey: orpc.music.get.queryKey(),
        });

        setOpen(false);
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

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open]);

  return (
    <FormWrapper open={open} setOpen={setOpen}>
      <DialogHeader>
        <DialogTitle>editing "{musicId.name}"</DialogTitle>
      </DialogHeader>
      <div className="flex items-center gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          method="post"
          encType={"multipart/form-data"}
        >
          <form.AppForm>
            <form.AppField
              name="name"
              children={(field) => (
                <>
                  <field.TextField label="display name" />
                  <FieldInfo field={field} />
                </>
              )}
            />
            <form.AppField
              name="robloxId"
              children={(field) => (
                <>
                  <field.TextField label="roblox id" />
                  <FieldInfo field={field} />
                </>
              )}
            />
            <form.Field name="tags" mode="array">
              {(field) => {
                return (
                  <div>
                    {field.state.value?.map((_, i) => {
                      return (
                        <form.AppField
                          key={i}
                          name={`tags[${i}]`}
                          children={(subField) => (
                            <>
                              <div className="flex w-full max-w-sm items-center gap-2">
                                <subField.TextFieldWithButton
                                  buttonProps={{
                                    className: "mt-8",
                                    type: "button",
                                    variant: "destructive",
                                    size: "icon",
                                    children: <Trash />,
                                    onClick: () => {
                                      field.removeValue(i);
                                    },
                                  }}
                                  label={`tag ${i + 1}`}
                                />
                              </div>

                              <FieldInfo field={subField} />
                            </>
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
            </form.Field>

            <form.AppField
              name="working"
              children={(field) => (
                <>
                  <field.SwitchField label="working" />
                  <FieldInfo field={field} />
                </>
              )}
            />

            {user?.user.permissions.includes("MANAGE_MUSIC_IDS") && (
              <form.AppField
                name="verified"
                children={(field) => (
                  <>
                    <field.SwitchField label="verified" />
                    <FieldInfo field={field} />
                  </>
                )}
              />
            )}
          </form.AppForm>
        </form>
      </div>

      <DialogFooter className="grid grid-cols-2">
        <Button
          disabled={isPending || !hasChanges}
          onClick={() => {
            const promise = mutateAsync({
              ...form.state.values,
              id: musicId.id,
            });
            toast.promise(promise, {
              loading: "saving...",
              success: `successfully saved "${musicId.name}"`,
              error: "something went wrong",
            });
          }}
        >
          {isPending && <LoaderCircle className="animate-spin" />}
          save
        </Button>
        <DialogClose asChild>
          <Button
            disabled={isPending}
            onClick={() => setOpen(false)}
            type="button"
            variant={"secondary"}
          >
            cancel
          </Button>
        </DialogClose>
      </DialogFooter>
    </FormWrapper>
  );
}
