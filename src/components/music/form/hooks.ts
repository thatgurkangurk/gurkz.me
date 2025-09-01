import { SubscribeButton } from "@/components/form/subscribe-button";
import { SwitchField } from "@/components/form/switch-field";
import { TextField } from "@/components/form/text-field";
import { TextFieldWithButton } from "@/components/form/text-field-with-button";
import { createFormHookContexts, createFormHook } from "@tanstack/react-form";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextFieldWithButton,
    SwitchField,
  },
  formComponents: {
    SubscribeButton,
  },
});
