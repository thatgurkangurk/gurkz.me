"use client";
import { useAtom, useAtomValue } from "jotai";
import { type IdFormat, idFormatAtom } from "./id-format";
import { Button } from "@/components/ui/button";
import { useHydrateAtoms } from "jotai/utils";
import { setIdFormatAction } from "./id-format/actions";

type FormatSelectorProps = Readonly<{
  idFormatFromServer?: IdFormat;
}>;

function SelectButton({ format, label }: { format: IdFormat; label: string }) {
  const [idFormat, setIdFormat] = useAtom(idFormatAtom);
  return (
    <Button
      formAction={setIdFormatAction.bind(null, format)}
      disabled={idFormat === format}
      onClick={() => setIdFormat(format)}
    >
      {label}
    </Button>
  );
}

export function FormatSelector({
  idFormatFromServer = "DEFAULT",
}: FormatSelectorProps) {
  useHydrateAtoms([[idFormatAtom, idFormatFromServer]]);
  const idFormat = useAtomValue(idFormatAtom);

  return (
    <>
      <p>current format: {idFormat}</p>
      <form className="flex flex-row gap-2">
        <SelectButton format="DEFAULT" label="default" />
        <SelectButton format="TRAITOR_TOWN" label="traitor town" />
      </form>
    </>
  );
}
