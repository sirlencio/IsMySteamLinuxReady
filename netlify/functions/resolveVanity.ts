import type { Handler } from "@netlify/functions";
import { fetchJSON } from "./helpers/fetch";

interface SteamVanityResponse {
    response: {
        success: number;
        steamid?: string;
        message?: string;
    };
}

export const handler: Handler = async (event) => {
    const vanity = event.queryStringParameters?.vanity;

    if (!vanity) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing vanity URL" })
        };
    }

    try {
        const data = await fetchJSON<SteamVanityResponse>(`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${process.env.STEAM_API_KEY}&vanityurl=${vanity}`);

        if (data?.response?.success === 1) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ steamid: data.response.steamid })
            };
        }

        return {
            statusCode: 404,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "User not found" })
        };

    } catch (err) {
        console.error("Error resolving vanity URL:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error" })
        };
    }
};