import mongoose, { Schema } from "mongoose";
import { IApiKey } from "../interfaces/interface";

const ApiKeySchema = new Schema<IApiKey>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    keyHash: { type: String, required: true },
    keyPrefix: { type: String, required: true }, // sk-xxxx (first 8 chars)
    requestCount: { type: Number, default: 0 },
    lastUsedAt: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ApiKey = mongoose.model<IApiKey>("ApiKey", ApiKeySchema);