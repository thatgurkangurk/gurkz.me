import { ComponentProps } from "react";
import { Button } from "../ui/button";
import { useFieldContext } from "@/components/music/form/hooks";
import { Label } from "../ui/label";
import { useId } from "react";
import { Input } from "../ui/input";

type ButtonProps = ComponentProps<typeof Button>;

export function TextFieldWithButton({
  label,
  buttonProps,
}: {
  label: string;
  buttonProps: ButtonProps;
}) {
  const field = useFieldContext<string>();
  const id = useId();
  return (
    <div className="pt-2 grid w-full max-w-sm items-center gap-3">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex w-full max-w-sm items-center gap-2">
        <Input
          aria-invalid={!field.state.meta.isValid}
          name={field.name}
          placeholder={label}
          id={id}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          className="h-10"
        />
        <Button {...buttonProps} className="h-10" />
      </div>
    </div>
  );
}
