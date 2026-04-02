import mongoose, { Schema } from "mongoose";
import { INotification } from "../interfaces/interface";

const NotificationSchema = new Schema<INotification>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    channel: { type: String, enum: ["email", "sms", "push"], required: true },
    recipient: { type: String, required: true },
    subject: String,
    body: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "queued", "sent", "failed", "retrying"],
      default: "pending",
    },
    attempts: { type: Number, default: 0 },
    sentAt: Date,
    failureReason: String,
    webhookUrl: String,
    jobId: String,
  },
  { timestamps: true }
);

NotificationSchema.index({ tenantId: 1, createdAt: -1 });
NotificationSchema.index({ status: 1 });

export const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);