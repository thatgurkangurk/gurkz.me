import { A } from "@solidjs/router";

export function Footer() {
  return (
    <div class="text-center">
      <hr class="h-1 border-0 rounded-md bg-themeGray" />

      <footer class="[grid-area:footer] pt-2">
        this website doesn't steal your information
        <br />
        have a nice day :)
        <br />
        <A href="/privacy" class="underline text-themeColor">
          read more
        </A>
      </footer>
    </div>
  );
}