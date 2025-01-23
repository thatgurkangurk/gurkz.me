import {
    TextField,
    TextFieldErrorMessage,
    TextFieldInput,
    TextFieldLabel,
} from "./ui/text-field";
import { Action, useAction } from "@solidjs/router";
import {
    type FieldErrors,
    type FormState,
    type FormValidator,
    formNameInputProps,
    getInitialFormState,
    toSetValidationErrors,
    toValidateField,
    validateForm,
} from "simple-stack-form/module";
import {
    type ComponentProps,
    Show,
    createContext,
    createEffect,
    createSignal,
    createUniqueId,
    useContext,
} from "solid-js";
import { useFormState, ValidateFormResult } from "~/lib/form";

export function useCreateFormContext(
    validator: FormValidator,
    action: Action<
        [formData: FormData],
        ValidateFormResult,
        [formData: FormData]
    >,
    fieldErrors?: FieldErrors
) {
    const initial = getInitialFormState({ validator, fieldErrors });
    const [formState, setFormState] = createSignal<FormState>(initial);
    return {
        value: formState,
        set: setFormState,
        setValidationErrors: toSetValidationErrors(setFormState),
        validateField: toValidateField(setFormState),
        action: action,
    };
}

export function useFormContext() {
    const formContext = useContext(FormContext);
    if (!formContext) {
        throw new Error(
            "Form context not found. `useFormContext()` should only be called from children of a <Form> component."
        );
    }
    return formContext;
}

type FormContextType = ReturnType<typeof useCreateFormContext>;

const FormContext = createContext<FormContextType | undefined>(undefined);

export function Form(
    props: {
        validator: FormValidator;
        context?: FormContextType;
        fieldErrors?: FieldErrors;
        onSuccess?: () => void;
        action: Action<
            [formData: FormData],
            ValidateFormResult,
            [formData: FormData]
        >;
    } & Omit<ComponentProps<"form">, "method" | "onSubmit">
) {
    const formContext =
        // eslint-disable-next-line solid/reactivity
        props.context ??
        // eslint-disable-next-line solid/reactivity
        useCreateFormContext(props.validator, props.action, props.fieldErrors);
    // eslint-disable-next-line solid/reactivity
    const runAction = useAction(props.action);

    return (
        <FormContext.Provider value={formContext}>
            <form
                {...props}
                method="post"
                onSubmit={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const formData = new FormData(e.currentTarget);
                    formContext.set((formState) => ({
                        ...formState,
                        isSubmitPending: true,
                        submitStatus: "validating",
                    }));
                    const parsed = await validateForm({
                        formData,
                        validator: props.validator,
                    });
                    if (parsed.data) {
                        formContext.set((value) => ({
                            ...value,
                            isSubmitPending: false,
                            submitStatus: "submitting",
                        }));
                        // eslint-disable-next-line solid/reactivity
                        return runAction(formData).then((data) => {
                            if (!data?.fieldErrors) props.onSuccess?.();
                            if (data?.fieldErrors) {
                                formContext.setValidationErrors(
                                    data.fieldErrors
                                );
                            }
                        });
                    }

                    formContext.setValidationErrors(parsed.fieldErrors);
                }}
            >
                <Show when={props.name}>
                    {(name) => <input {...formNameInputProps} value={name()} />}
                </Show>
                {props.children}
            </form>
        </FormContext.Provider>
    );
}

export function Input(
    inputProps: ComponentProps<typeof TextField> & { name: string }
) {
    const id = createUniqueId();
    const formContext = useFormContext();
    const formState = useFormState(formContext.action);
    const fieldState = () => {
        const value = formContext.value().fields[inputProps.name];
        if (!value) {
            throw new Error(
                `Input "${inputProps.name}" not found in form. Did you use the <Form> component?`
            );
        }
        return value;
    };
    const [fieldValue, setFieldValue] = createSignal<
        string | number | string[] | undefined
    >();

    createEffect(() => {
        if (formState.result?.data) {
            setFieldValue(undefined);
        }
    });
    return (
        <TextField
            validationState={
                fieldState().validationErrors ? "invalid" : "valid"
            }
            {...inputProps}
        >
            <TextFieldLabel for={id}>{inputProps.name}</TextFieldLabel>
            <TextFieldInput
                id={id}
                value={fieldValue() || ""}
                onInput={(e) => {
                    setFieldValue(e.currentTarget.value);
                    if (!fieldState().hasErroredOnce) return;
                    const value = (e.target as HTMLInputElement).value;
                    formContext.validateField(
                        inputProps.name,
                        value,
                        fieldState().validator
                    );
                }}
                onBlur={(e) => {
                    const value = e.target.value;
                    if (value === "") return;
                    formContext.validateField(
                        inputProps.name,
                        value,
                        fieldState().validator
                    );
                }}
            />
            <TextFieldErrorMessage>
                <Show when={fieldState().validationErrors}>
                    {(errors) => <>{errors()?.join(", ")}</>}
                </Show>
            </TextFieldErrorMessage>
        </TextField>
    );
}
