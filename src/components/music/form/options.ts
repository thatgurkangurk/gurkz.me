import { formOptions } from "@tanstack/react-form";
import { type CreateMusicIdFormValues, schema } from "./schema";

export const formOpts = formOptions({
  defaultValues: {
    name: "",
    robloxId: "",
    tags: [] as string[],
  } satisfies CreateMusicIdFormValues,
  validators: {
    onChange: schema,
  },
});
