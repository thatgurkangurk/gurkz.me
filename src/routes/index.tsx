import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

function Home() {
  return (
    <main class="mx-auto p-4">
      <Alert>
        <AlertTitle>warning</AlertTitle>
        <AlertDescription>this website is work in progress</AlertDescription>
      </Alert>
      <h1 class="max-6-xs text-6xl pt-4">hello! 👋</h1>
    </main>
  );
}

export default Home;
