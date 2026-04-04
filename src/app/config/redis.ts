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
export const redis = new Redis(config.redis_URL as string, {
  maxRetriesPerRequest: null,      // Important for BullMQ + Railway
  enableReadyCheck: false,
  family: 0,                       // Helps with IPv4/IPv6 issues on Railway
});

export const redisSubscriber = new Redis(config.redis_URL as string, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  family: 0,
});

// You can keep this if some parts of your code (like rate-limit-redis) need it
export const redisConnectionOptions = {
  url: config.redis_URL as string,   // Better than manually parsing
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  family: 0,
};