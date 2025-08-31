import { useAtomValue } from "jotai";
import { formatMusicId, idFormatAtom } from "./id-format";

export function FormattedId({ robloxId }: { robloxId: string | number }) {
  const idFormat = useAtomValue(idFormatAtom);

  return <span className="pr-2">{formatMusicId(robloxId, idFormat)}</span>;
}
