import { formatMusicId, useIdFormat } from "../../pages/music/_idFormat";

export function FormattedId(props: { id: number }) {
    const [format] = useIdFormat();

    return <>{formatMusicId(props.id, format())}</>;
}
