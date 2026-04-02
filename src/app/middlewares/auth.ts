import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { TUserRole } from '../modules/User/user.interface';
import { User } from '../modules/User/user.model';
import catchAsync from '../utils/catchAsync';
import { AuthRequest } from './rateLimiter';
import { ApiKey } from '../modules/models/apiKey';
import crypto from "crypto";
import { verifyToken } from '../modules/Auth/auth.utils';

export const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized!"
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded: JwtPayload;
    try {
      decoded = verifyToken(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;
    } catch {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Invalid token!"
      );
    }

    const { role, userId, iat } = decoded;

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "User is deleted!");
    }

    if (user.status === "blocked") {
      throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
    }

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number
      )
    ) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Token expired after password change!"
      );
    }

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Access denied!"
      );
    }

    req.user = decoded as JwtPayload & { role: string };
    req.tenantId = userId;
    next();
  });
};

// JWT auth — for dashboard
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized!"
    );
  }
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = verifyToken(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;
    req.tenantId = decoded._id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// API key auth — for programmatic access
export const requireApiKey = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const key = req.headers["x-api-key"] as string;
  if (!key) return res.status(401).json({ message: "API key required" });

  const keyHash = crypto.createHash("sha256").update(key).digest("hex");
  const apiKey = await ApiKey.findOne({ keyHash, isActive: true });

  if (!apiKey) return res.status(401).json({ message: "Invalid API key" });

  await ApiKey.findByIdAndUpdate(apiKey._id, {
    $inc: { requestCount: 1 },
    lastUsedAt: new Date(),
  });

  req.tenantId = apiKey.tenantId.toString();
  next();
};

// Accepts either JWT or API key
export const requireAuthOrApiKey = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey) return requireApiKey(req, res, next);
  return requireAuth(req, res, next);
};
