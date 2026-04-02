import mongoose, { Document } from "mongoose";
import { TemplateBlock } from "../Zod/zod.schema";

export type NotificationStatus =
  | "pending"
  | "queued"
  | "sent"
  | "failed"
  | "retrying";

export type Channel = "email" | "sms" | "push";

export interface INotification extends Document {
  tenantId: mongoose.Types.ObjectId;
  channel: Channel;
  recipient: string;
  subject?: string;
  body: string;
  status: NotificationStatus;
  attempts: number;
  sentAt?: Date;
  failureReason?: string;
  webhookUrl?: string;
  jobId?: string;
}

export interface ITemplate extends Document {
  tenantId: mongoose.Types.ObjectId;
  name: string;
  channel: Channel;
  subject?: string;
  blocks: TemplateBlock[];
  variables: string[];
}

export interface NotificationLog {
  _id: string;
  channel: Channel;
  recipient: string;
  subject?: string;
  body: string;
  status: NotificationStatus;
  attempts: number;
  sentAt?: string;
  failureReason?: string;
  createdAt: string;
}

export interface Template {
  _id: string;
  name: string;
  channel: Channel;
  subject?: string;
  blocks: TemplateBlock[];
  variables: string[];
  createdAt: string;
}

export interface ApiKey {
  _id: string;
  name: string;
  key: string;
  lastUsedAt?: string;
  requestCount: number;
  createdAt: string;
}

export interface AnalyticsSummary {
  total: number;
  sent: number;
  failed: number;
  pending: number;
  byChannel: Record<Channel, number>;
  deliveryRate: number;
}

export interface IApiKey extends Document {
  tenantId: mongoose.Types.ObjectId;
  name: string;
  keyHash: string;
  keyPrefix: string;
  requestCount: number;
  lastUsedAt?: Date;
  createdAt?: Date;
  isActive: boolean;
}

export type NotificationQuery = {
  page?: string | number;
  limit?: string | number;
  status?: string;
  channel?: string;
};