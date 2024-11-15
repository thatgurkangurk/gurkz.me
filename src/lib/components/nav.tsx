import { For } from "solid-js";

type Link = {
    text: string;
    href: string;
}

function NavLink(props: Link) {
    return <a href={props.href}>{props.text}</a>
}

export function Nav(props: {
    links: Link[]
}) {
    return <For each={props.links}>
        {(link) => <NavLink {...link} />}
    </For>
}