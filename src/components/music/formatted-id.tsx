import { CopyButton } from "../copy-button";
import { formatId, idFormat } from "~/lib/music/id-format";

export function FormattedId(props: { id: string }) {
    const formattedId = () => formatId(props.id, idFormat());
    return (
        <>
            <span class="pr-2">{formattedId()}</span>
            <CopyButton content={formattedId()} />
        </>
    );
}
