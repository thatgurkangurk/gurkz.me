import { useAtomValue } from "jotai";
import { formatMusicId, idFormatAtom } from "./id-format";

type FormattedIdProps = Readonly<{
  robloxId: string | number;
}>;

export function FormattedId({ robloxId }: FormattedIdProps) {
  const idFormat = useAtomValue(idFormatAtom);

  return <span className="pr-2">{formatMusicId(robloxId, idFormat)}</span>;
}
