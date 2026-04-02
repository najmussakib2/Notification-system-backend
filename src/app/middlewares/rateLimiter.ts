/* eslint-disable @typescript-eslint/no-explicit-any */
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redis } from "../config/redis";
import { Request } from "express";

export interface AuthRequest extends Request {
  tenantId?: string; 
}

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  keyGenerator: (req: AuthRequest) => {
    // if tenant is identified, rate limit by tenant (more accurate)
    if (req.tenantId) return req.tenantId;
    // fallback to IP with proper IPv6 handling
    return ipKeyGenerator(req.ip as string);
  },
  store: new RedisStore({
    sendCommand: (...args: string[]) =>
      redis.call(args[0], ...args.slice(1)) as any,
  }),
  handler: (req, res) =>
    res.status(429).json({ message: "Rate limit exceeded. Try again in 1 minute." }),
});