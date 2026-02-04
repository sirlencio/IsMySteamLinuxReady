import type { LinuxSupport } from "../../../src/types/linuxSupport";
import { fetchJSON } from "./fetch";

const PROTON_API =
    "https://www.protondb.com/api/v1/reports/summaries";

interface ProtonSummary {
    tier: string | null;
}

function mapProtonTier(tier: string | null): LinuxSupport {
    if (!tier) return "Unknown";
    const t = tier.toLowerCase();
    if (t === "platinum") return "VeryCompatible";
    if (t === "gold" || t === "silver") return "Compatible";
    return "Unknown";
}

export async function getProtonSupport(appid: number): Promise<LinuxSupport> {
    try {
        const url = `${PROTON_API}/${appid}.json`;
        const data = await fetchJSON<ProtonSummary>(url);
        return mapProtonTier(data.tier);
    } catch {
        return "Unknown";
    }
}

export function getProtonStoreUrl(appid: number): string {
    return `https://www.protondb.com/app/${appid}`;
}
