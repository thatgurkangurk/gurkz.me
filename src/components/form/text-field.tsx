import { useFieldContext } from "@/components/music/form/hooks";
import { Label } from "../ui/label";
import { useId } from "react";
import { Input } from "../ui/input";

export function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  const id = useId();
  return (
    <div className="pt-2 grid w-full max-w-sm items-center gap-3">
      <Label htmlFor={id}>{label}</Label>
      <Input
        aria-invalid={!field.state.meta.isValid}
        name={field.name}
        placeholder={label}
        id={id}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
    </div>
  );
}
