import { A } from "@solidjs/router";

export default function Projects() {
  return (
    <>
      <h1 class="text-4xl pt-2">projects</h1>
      <ul class="flex flex-col gap-1.5">
        <li>
          <A href="/project/badapple">bad apple in HTML</A>
        </li>
        <li>
          <A href="/project/webhook-destroyer">webhook destroyer</A>
        </li>
      </ul>
    </>
  );
}
