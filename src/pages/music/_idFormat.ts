import type { IdFormat } from "./_types";

function formatMusicId(id: number, format: IdFormat): string {
    switch (format) {
        case "DEFAULT": {
            return id.toString();
        }
        case "TRAITOR_TOWN": {
            return `s/${id}`;
        }
        default: {
            return id.toString();
        }
    }
}

export { formatMusicId };
