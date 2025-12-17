import { useAtomValue } from "jotai";
import { rateLimit } from "@tanstack/react-pacer";
import { type IdFormat, idFormat } from "./format";
import { CopyButton } from "../ui/shadcn-io/copy-button";
import { event } from "onedollarstats";

function formatId(robloxId: string, format: IdFormat) {
  switch (format) {
    case "DEFAULT": {
      return robloxId;
    }
    case "TRAITOR_TOWN": {
      return `s/${robloxId}`;
    }
    default: {
      return robloxId;
    }
  }
}

const rateLimitedCopyEvent = rateLimit(
  (id: string, format: IdFormat) =>
    event("music/copy-id", {
      id: id,
      format: format,
    }),
  {
    limit: 20,
    window: 6 * 1000, // 1 minute,
    windowType: "fixed",
  }
);

export function FormattedId(
  props: Readonly<{
    robloxId: string;
  }>
) {
  const format = useAtomValue(idFormat);

  return (
    <>
      <span>{formatId(props.robloxId, format)}</span>
      <CopyButton
        variant={"outline"}
        content={formatId(props.robloxId, format)}
        delay={500}
        onClick={() => rateLimitedCopyEvent(props.robloxId, format)}
      />
    </>
  );
}
