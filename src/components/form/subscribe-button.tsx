import { useFormContext } from "../music/form/hooks";
import { Button } from "../ui/button";

export function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          onClick={() => form.handleSubmit()}
          type="submit"
          disabled={isSubmitting}
        >
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
}
