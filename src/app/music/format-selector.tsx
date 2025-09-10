"use client";
import { useAtom } from "jotai";
import { type IdFormat, idFormatAtom } from "./id-format";
import { Button } from "@/components/ui/button";
import { useHydrateAtoms } from "jotai/utils";
import { setIdFormatAction } from "./id-format/actions";

type FormatSelectorProps = Readonly<{
  idFormatFromServer?: IdFormat;
}>;

export function FormatSelector({
  idFormatFromServer = "DEFAULT",
}: FormatSelectorProps) {
  useHydrateAtoms([[idFormatAtom, idFormatFromServer]]);
  const [idFormat, setIdFormat] = useAtom(idFormatAtom);

  return (
    <>
      <p>current format: {idFormat}</p>
      <form className="flex flex-row gap-2">
        <Button
          formAction={setIdFormatAction.bind(null, "DEFAULT")}
          disabled={idFormat === "DEFAULT"}
          onClick={() => setIdFormat("DEFAULT")}
        >
          default
        </Button>
        <Button
          formAction={setIdFormatAction.bind(null, "TRAITOR_TOWN")}
          disabled={idFormat === "TRAITOR_TOWN"}
          onClick={() => setIdFormat("TRAITOR_TOWN")}
        >
          traitor town
        </Button>
      </form>
    </>
  );
}
