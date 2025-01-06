import { z } from "zod";

const IdFormatEnum = z.enum(["DEFAULT", "TRAITOR_TOWN"]).default("DEFAULT");
type IdFormat = z.infer<typeof IdFormatEnum>;

type MusicId = {
    id: string;
    name: string;
    robloxId: number;
    createdById: string;
    created: Date;
    working: boolean;
    creator: Creator;
};

type Creator = {
    id: string;
    name: string | null;
    image: string | null;
};

export { IdFormatEnum, type IdFormat, type MusicId, type Creator };
