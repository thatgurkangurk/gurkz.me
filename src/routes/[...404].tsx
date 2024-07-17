import { A, useLocation } from "@solidjs/router";
import { OctagonAlert } from "lucide-solid";
import { Button } from "~/lib/components/ui/button";

export default function NotFound() {
  const location = useLocation();
  return (
    <>
      <div class="flex gap-2 items-center py-2 text-red-600 dark:text-red-400">
        <OctagonAlert class="h-12 w-12" />
        <h2 class="text-3xl">not found</h2>
      </div>
      <p>there isn't any page at {location.pathname}</p>
      <Button as={A} href="/">
        go home
      </Button>
    </>
  );
}
