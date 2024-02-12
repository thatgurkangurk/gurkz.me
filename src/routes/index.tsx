import { A } from "@solidjs/router";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

export default function Home() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        hello! 👋
      </h1>
      <Alert>
        <AlertTitle>warning</AlertTitle>
        <AlertDescription>
           this website is work in progress
        </AlertDescription>
      </Alert>
    </main>
  );
}
