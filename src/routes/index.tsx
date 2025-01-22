import { Title } from "@solidjs/meta";
import { ModeToggle } from "~/components/mode-toggle";

export default function Home() {
    return (
        <>
            <Title>home</Title>
            <h1 class="text-3xl">hello, world!</h1>
            <ModeToggle />
        </>
    );
}
