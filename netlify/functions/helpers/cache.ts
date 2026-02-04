import { Redis } from '@upstash/redis';
import type { LinuxSupport } from '../../../src/types/linuxSupport';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export interface CachedGame {
  appid: number;
  name: string;
  storeUrl: string;
  image: string;
  linuxSupport: LinuxSupport;
}

export async function getCachedGames(appids: number[]): Promise<(CachedGame | null)[]> {
  if (appids.length === 0) return [];
  const keys = appids.map(id => `game:${id}`);
  
  return await redis.mget<(CachedGame | null)[]>(...keys);
}

export async function setCachedGame(appid: number, data: CachedGame, exTime: number = 604800): Promise<void> {
  await redis.set(`game:${appid}`, data, { ex: exTime });
}