import { useAtom } from "jotai";
import { idFormatAtom } from "./id-format";
import { Button } from "@/components/ui/button";

export function FormatSelector() {
  const [idFormat, setIdFormat] = useAtom(idFormatAtom);

  return (
    <>
      <p>current format: {idFormat}</p>
      <div className="flex flex-row gap-2">
        <Button
          disabled={idFormat === "DEFAULT"}
          onClick={() => setIdFormat("DEFAULT")}
        >
          default
        </Button>
        <Button
          disabled={idFormat === "TRAITOR_TOWN"}
          onClick={() => setIdFormat("TRAITOR_TOWN")}
        >
          traitor town
        </Button>
      </div>
    </>
  );
}
