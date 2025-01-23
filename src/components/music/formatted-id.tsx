import { CopyButton } from "../copy-button";
import { formatId } from "~/lib/music/id-format";

export function FormattedId(props: { id: string }) {
    return (
        <>
            <span class="pr-2">{formatId(props.id)}</span>
            <CopyButton content={formatId(props.id)} />
        </>
    );
}
