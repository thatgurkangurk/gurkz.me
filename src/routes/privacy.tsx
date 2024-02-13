import { A } from "@solidjs/router";

export default function Privacy() {
  return (
    <>
      <h1>privacy policy</h1>
      <p>
        first of all: <span class="font-bold">thanks for visiting :)</span>
      </p>
      <p>
        this website uses{" "}
        <A href="https://www.umami.is" class="underline text-themeColor">
          umami analytics
        </A>
        , which does <i>not</i> collect any personally identifiable information.
      </p>
      <p>cookies we use and why:</p>
      <ul class="list-disc list-inside">
        <li>
          <code>kb-color-mode</code>: this simply saves whether you want dark
          mode or light mode
        </li>
      </ul>
    </>
  );
}
