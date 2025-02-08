import {
    TextField,
    TextFieldErrorMessage,
    TextFieldInput,
    TextFieldLabel,
} from "../ui/text-field";
import { createUniqueId, JSX, splitProps } from "solid-js";

type TextInputProps = {
    name: string;
    type: "text" | "email" | "tel" | "password" | "url" | "date";
    label?: string;
    placeholder?: string;
    value: string | undefined;
    error: string;
    required?: boolean;
    ref: (element: HTMLInputElement) => void;
    onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
    onChange: JSX.EventHandler<HTMLInputElement, Event>;
    onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
};

export function TextInput(props: TextInputProps) {
    const [, inputProps] = splitProps(props, ["value", "label", "error"]);
    const id = createUniqueId();

    return (
        <TextField validationState={props.error ? "invalid" : "valid"}>
            <TextFieldLabel for={id}>
                {props.label} {props.required && <span>*</span>}
            </TextFieldLabel>
            <TextFieldInput
                {...inputProps}
                id={id}
                value={props.value || ""}
                aria-invalid={!!props.error}
                aria-errormessage={`${props.name}-error`}
            />
            {props.error && (
                <TextFieldErrorMessage id={`${props.name}-error`}>
                    {props.error}
                </TextFieldErrorMessage>
            )}
        </TextField>
    );
}
