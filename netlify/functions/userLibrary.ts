import { getOwnedGames, getPlayerSummary, type OwnedGame } from "./helpers/steam";
import { fetchGamesInBatches } from "./helpers/batching";
import { getProtonSupport, getProtonStoreUrl } from "./helpers/proton";
import { getSteamGridInfo, getSteamGridImage } from "./helpers/steamGrid";
import { getCachedGames, setCachedGame, type CachedGame, } from "./helpers/cache";
import type { Handler } from "@netlify/functions";
import type { UserGame } from "../../src/types/UserGame";
import type { LinuxSupport } from "../../src/types/linuxSupport";

const PLACEHOLDER_IMAGE = "/images/placeholder.png";
const TTL_LONG = 2592000;
const TTL_SHORT = 604800;

export const handler: Handler = async (event) => {
    const steamid = event.queryStringParameters?.steamid;
    if (!steamid) return { statusCode: 400, body: "Missing steamid" };

    try {
        const [ownedGames, user] = await Promise.all([
            getOwnedGames(steamid),
            getPlayerSummary(steamid)
        ]);

        if (!ownedGames || ownedGames.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Your library is private or empty." })
            };
        }
        const appids = ownedGames.map(g => g.appid);
        const cachedResults = await getCachedGames(appids);

        const finalGames: UserGame[] = [];
        const missingGames: OwnedGame[] = [];

        ownedGames.forEach((game, index) => {
            const cached = cachedResults[index];
            if (cached) {
                finalGames.push({
                    ...cached,
                    playtime: game.playtime_forever
                });
            } else {
                missingGames.push(game);
            }
        });

        console.log(`[Cache] Hits: ${finalGames.length}, Misses: ${missingGames.length}`);

        if (missingGames.length > 0) {
            const processedNewGames = await fetchGamesInBatches(
                missingGames,
                10,
                async (game): Promise<UserGame> => {
                    try {
                        const [linuxSupport, gridInfo] = await Promise.all([
                            getProtonSupport(game.appid),
                            getSteamGridInfo(game.appid),
                        ]);

                        const image = gridInfo.gridId
                            ? await getSteamGridImage(gridInfo.gridId)
                            : null;

                        const gameStaticData: CachedGame = {
                            appid: game.appid,
                            name: game.name,
                            storeUrl: getProtonStoreUrl(game.appid),
                            image: image ?? PLACEHOLDER_IMAGE,
                            linuxSupport,
                        };

                        const ttl = linuxSupport === "VeryCompatible" ? TTL_LONG : TTL_SHORT;

                        setCachedGame(game.appid, gameStaticData, ttl).catch(e =>
                            console.error(`Error saving cache for ${game.appid}:`, e)
                        );

                        return {
                            ...gameStaticData,
                            playtime: game.playtime_forever
                        };
                    } catch (err) {
                        console.error(`Error processing game ${game.appid}:`, err);
                        return {
                            appid: game.appid,
                            name: game.name,
                            storeUrl: getProtonStoreUrl(game.appid),
                            image: PLACEHOLDER_IMAGE,
                            linuxSupport: "Unknown" as LinuxSupport,
                            playtime: game.playtime_forever
                        };
                    }
                }
            );

            finalGames.push(...processedNewGames);
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user, games: finalGames }),
        };

    } catch (err) {
        console.error("Critical Handler Error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to build library" }),
        };
    }
};