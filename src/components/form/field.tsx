import {
    TextField,
    TextFieldLabel,
    TextFieldInput,
    TextFieldErrorMessage,
} from "../ui/text-field";
import { type FieldApi } from "@tanstack/solid-form";
import { createUniqueId, VoidComponent } from "solid-js";

type FieldProps = {
    field: FieldApi<
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any
    >;
    label: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FieldInfo(props: { field: FieldApi<any, any, any, any> }) {
    return (
        <>
            {props.field.state.meta.isTouched &&
            props.field.state.meta.errors.length ? (
                <TextFieldErrorMessage>
                    {props.field.state.meta.errors.join(",")}
                </TextFieldErrorMessage>
            ) : null}
        </>
    );
}

const Field: VoidComponent<FieldProps> = (props) => {
    const id = createUniqueId();
    return (
        <>
            <TextField
                id={id}
                validationState={
                    props.field.state.meta.errors.length ? "invalid" : "valid"
                }
            >
                <TextFieldLabel for={id}>{props.label}</TextFieldLabel>
                <TextFieldInput
                    value={props.field.state.value}
                    onBlur={props.field.handleBlur}
                    onInput={(e) =>
                        props.field.handleChange(e.currentTarget.value)
                    }
                />
                <FieldInfo field={props.field} />
            </TextField>
        </>
    );
};

export { type FieldProps, Field };
