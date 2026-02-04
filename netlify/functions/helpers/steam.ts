import { fetchJSON } from "./fetch";

export interface OwnedGame {
    appid: number;
    name: string,
    playtime_forever: number;
}

const STEAM_API = "https://api.steampowered.com";

interface SteamOwnedGamesResponse {
  response: {
    game_count?: number;
    games?: OwnedGame[];
  };
}

interface SteamSummaryResponse {
  response: {
    players: Array<{
      personaname: string;
      avatarfull: string;
    }>;
  };
}

export async function getOwnedGames(steamId: string): Promise<OwnedGame[]> {
  const url = `${STEAM_API}/IPlayerService/GetOwnedGames/v1/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}&include_appinfo=true&format=json`;
  
  const data = await fetchJSON<SteamOwnedGamesResponse>(url);
  return data.response?.games ?? [];
}

export async function getPlayerSummary(steamId: string) {
  const url = `${STEAM_API}/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${steamId}`;

  const data = await fetchJSON<SteamSummaryResponse>(url);
  const player = data.response?.players?.[0];

  if (!player) throw new Error("User not found");

  return {
    name: player.personaname,
    avatar: player.avatarfull,
    profileURL: `https://steamcommunity.com/profiles/${steamId}/`
  };
}