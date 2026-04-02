import { Redis } from "ioredis";
import config from ".";

export const redis = new Redis(config.redis_URL as string);
export const redisSubscriber = new Redis(config.redis_URL as string);

export const redisConnectionOptions = {
  host: new URL(config.redis_URL as string).hostname,
  port: Number(new URL(config.redis_URL as string).port) || 6379,
};