import { Redis } from '@upstash/redis';
import type { Config } from "@netlify/functions";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default async () => {
  try {
    await redis.set('maintenance:last_ping', new Date().toISOString());
    
    console.log("Mantenimiento de Upstash completado con éxito.");
    
    return new Response("Database awoken", { status: 200 });
  } catch (error) {
    console.error("Error en el ping de Upstash:", error);
    return new Response("Check logs", { status: 500 });
  }
};

export const config: Config = {
  schedule: "@monthly"
};
