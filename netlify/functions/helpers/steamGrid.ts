import { fetchJSON } from "./fetch";

const STEAMGRIDB_API_URL = "https://www.steamgriddb.com/api/v2";

interface SGDBGameResponse {
    success: boolean;
    data: {
        id: number;
        name: string;
    };
}

interface SGDBImageResponse {
    success: boolean;
    data: Array<{
        url: string;
        thumb: string;
        score: number;
    }>;
}

export async function getSteamGridInfo(appid: number): Promise<{ gridId: number | null }> {
    const url = `${STEAMGRIDB_API_URL}/games/steam/${appid}`;
    try {
        const data = await fetchJSON<SGDBGameResponse>(url, {
            headers: { Authorization: `Bearer ${process.env.STEAMGRIDDB_API_KEY}` }
        });
        return { gridId: data.data?.id ?? null };
    } catch {
        return { gridId: null };
    }
}

export async function getSteamGridImage(gridId: number): Promise<string | null> {
    const url = `${STEAMGRIDB_API_URL}/grids/game/${gridId}?dimensions=600x900`;
    try {
        const data = await fetchJSON<SGDBImageResponse>(url, {
            headers: { Authorization: `Bearer ${process.env.STEAMGRIDDB_API_KEY}` }
        });
        return data.data?.[0]?.url ?? null;
    } catch {
        return null;
    }
}