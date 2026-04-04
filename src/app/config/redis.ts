import Redis from "ioredis";
import config from ".";

// export const redis = new Redis(config.redis_URL as string);
// export const redisSubscriber = new Redis(config.redis_URL as string);

// export const redisConnectionOptions = {
//   host: new URL(config.redis_URL as string).hostname,
//   port: Number(new URL(config.redis_URL as string).port) || 6379,
// };

// Best way for Railway: Use the full REDIS_URL directly
// This automatically includes username + password
// Get the URL from config
const redisUrl = config.redis_URL as string;

if (!redisUrl) {
  throw new Error("REDIS_URL is not defined in config");
}

// Create Redis client with proper options
export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  family: 0,                    // Critical for Railway (IPv4 + IPv6)
  retryStrategy: (times: number) => Math.min(times * 50, 2000), // optional but helpful
});

export const redisSubscriber = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  family: 0,
});

// You can keep this if some parts of your code (like rate-limit-redis) need it
export const redisConnectionOptions = {
  host: new URL(config.redis_URL as string).hostname,
  port: Number(new URL(config.redis_URL as string).port) || 6379,
};

console.log("✅ Redis client initialized with URL:", redisUrl ? "Yes (hidden for security)" : "No URL");