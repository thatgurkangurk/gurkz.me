import { useFieldContext } from "@/components/music/form/hooks";
import { Label } from "../ui/label";
import { useId } from "react";
import { Switch } from "@/components/ui/switch";

export function SwitchField({ label }: { label: string }) {
  const field = useFieldContext<boolean>();
  const id = useId();
  return (
    <div className="pt-2 grid w-full max-w-sm items-center gap-3">
      <Label htmlFor={id}>{label}</Label>
      <Switch
        aria-invalid={!field.state.meta.isValid}
        name={field.name}
        id={id}
        checked={field.state.value}
        onCheckedChange={(value) => field.handleChange(value)}
        onBlur={field.handleBlur}
      />
    </div>
  );
}
