/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";
import { ApiKey } from "../models/apiKey";
import AppError from "../../errors/AppError";

const createApiKey = async (payload: any, tenantId: string) => {
    const { name } = payload;
    if (!name) throw new AppError(400, "Name is required");

    const rawKey = `sk-${crypto.randomBytes(24).toString("hex")}`;
    const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");
    const keyPrefix = rawKey.slice(0, 8);

    const apiKey = await ApiKey.create({
        tenantId,
        name,
        keyHash,
        keyPrefix,
    });

    // return raw key ONCE — never stored again
    return {
        _id: apiKey._id,
        name: apiKey.name,
        key: rawKey, // only returned on creation
        keyPrefix,
        createdAt: apiKey.createdAt,
    }
}
const getApiKeys = async (tenantId: string) => {
    const keys = await ApiKey.find({ tenantId, isActive: true })
        .select("-keyHash")
        .sort({ createdAt: -1 });

    return keys.map((k) => ({
        _id: k._id,
        name: k.name,
        key: `${k.keyPrefix}${"*".repeat(20)}`,
        requestCount: k.requestCount,
        lastUsedAt: k.lastUsedAt,
        createdAt: k.createdAt,
    }))

}
const deleteApiKey = async (id: string, tenantId: string) => {
    const key = await ApiKey.findOneAndUpdate(
        { _id: id, tenantId },
        { isActive: false },
        { new: true }
    );
    if (!key) throw new AppError(404, "API key not found");
    return { message: "API key revoked" };
}

export const ApiKeyService = {
    createApiKey,
    getApiKeys,
    deleteApiKey,
}