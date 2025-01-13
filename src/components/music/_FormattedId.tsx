import { formatMusicId, useIdFormat } from "../../pages/music/_idFormat";
import { CopyButton } from "../copy-button";

export function FormattedId(props: { id: string }) {
    const [format] = useIdFormat();

    return (
        <>
            <span class="pr-2">{formatMusicId(props.id, format())}</span>
            <CopyButton content={formatMusicId(props.id, format())} />
        </>
    );
}
