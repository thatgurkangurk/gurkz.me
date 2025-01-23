import { Action, useSubmission } from "@solidjs/router";
import { validateForm } from "simple-stack-form/module";

export type ValidateFormResult = Awaited<
    ReturnType<typeof validateForm>
> | null;

export function useFormState(
    action: Action<
        [formData: FormData],
        ValidateFormResult,
        [formData: FormData]
    >
) {
    return useSubmission(action);
}
