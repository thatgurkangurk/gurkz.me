import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { HttpStatusCode } from "@solidjs/start";

export default function NotFound() {
    return (
        <main>
            <Title>not found</Title>
            <HttpStatusCode code={404} />
            <h1 class="text-3xl">not found</h1>
            <A href={"/"}>go back home</A>
        </main>
    );
}
