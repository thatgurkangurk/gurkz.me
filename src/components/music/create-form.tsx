import { useForm, useStore } from "@tanstack/react-form";
import { formOpts } from "./form-options";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { useId } from "react";
import { IGNORE_PASSWORD_MANAGERS } from "~/lib/utils/password-managers";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { LoaderCircle, XIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "~/lib/orpc";
import { toast } from "sonner";

export function CreateMusicIdForm() {
  const id = useId();
  const { mutateAsync, isPending } = useMutation(
    orpc.music.create.mutationOptions()
  );
  const queryClient = useQueryClient();
  const form = useForm({
    ...formOpts,
    onSubmit: async ({ formApi, value }) => {
      await mutateAsync(value);

      await queryClient.refetchQueries({
        queryKey: orpc.music.list.queryKey(),
      });

      formApi.reset();
    },
  });

  const formErrors = useStore(form.store, (formState) => formState.errors);

  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <CardTitle>create a music id</CardTitle>
        <FieldError errors={formErrors} />
      </CardHeader>
      <CardContent>
        <form
          id={id}
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      // i HATE password managers!!!!!!!!!!!!!!!
                      {...IGNORE_PASSWORD_MANAGERS}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                );
              }}
            />
            <form.Field
              name="robloxId"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>roblox id</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />

                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                );
              }}
            />
            <form.Field name="tags" mode="array">
              {(field) => {
                return (
                  <FieldSet className="gap-4">
                    <FieldLegend variant="label">tags</FieldLegend>
                    <FieldDescription>add up to 4 tags</FieldDescription>
                    <FieldGroup className="gap-4">
                      {field.state.value.map((_, index) => (
                        <form.Field
                          key={`tags[${index}]`}
                          name={`tags[${index}]`}
                          children={(subField) => {
                            const isSubFieldInvalid =
                              subField.state.meta.isTouched &&
                              !subField.state.meta.isValid;
                            return (
                              <Field
                                orientation="horizontal"
                                data-invalid={isSubFieldInvalid}
                              >
                                <FieldContent>
                                  <InputGroup>
                                    <InputGroupInput
                                      id={`tags-${index}`}
                                      name={subField.name}
                                      value={subField.state.value}
                                      onBlur={subField.handleBlur}
                                      onChange={(e) =>
                                        subField.handleChange(e.target.value)
                                      }
                                      aria-invalid={isSubFieldInvalid}
                                    />
                                    <InputGroupAddon align="inline-end">
                                      <InputGroupButton
                                        type="button"
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={() => field.removeValue(index)}
                                        aria-label={`Remove tag ${index + 1}`}
                                      >
                                        <XIcon />
                                      </InputGroupButton>
                                    </InputGroupAddon>
                                  </InputGroup>
                                  <FieldError
                                    errors={subField.state.meta.errors}
                                  />
                                </FieldContent>
                              </Field>
                            );
                          }}
                        />
                      ))}
                      <div className="min-w-full grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => field.pushValue("")}
                          disabled={field.state.value.length >= 4}
                        >
                          add tag
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => field.clearValues()}
                          disabled={field.state.value.length === 0}
                        >
                          remove all tags
                        </Button>
                      </div>
                    </FieldGroup>
                    <FieldError errors={field.state.meta.errors} />
                  </FieldSet>
                );
              }}
            </form.Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation={"horizontal"}>
          <form.Subscribe selector={(state) => state.isValid}>
            {(isValid) => (
              <Button
                disabled={isPending || !isValid}
                onClick={() => {
                  const promise = form.handleSubmit(form.state.values);
                  toast.promise(promise, {
                    loading: "creating...",
                    success: `successfully created`,
                    error: "something went wrong",
                    position: "top-center",
                  });
                }}
              >
                {isPending && <LoaderCircle className="animate-spin" />} create
              </Button>
            )}
          </form.Subscribe>
        </Field>
      </CardFooter>
    </Card>
  );
}
