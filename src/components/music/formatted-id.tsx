import { formatId } from "~/lib/music/id-format";

export function FormattedId(props: { id: string }) {
    return <span>{formatId(props.id)}</span>;
}
