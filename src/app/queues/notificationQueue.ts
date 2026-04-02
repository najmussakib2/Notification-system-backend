import { Queue, Worker } from "bullmq";
import { redisConnectionOptions } from "../config/redis";
import axios from "axios";
import { Notification } from "../modules/models/Notification";
import { getIO } from "../../socket io/socket.io";
import { sendSms } from "../channels/sms";
import { sendPush } from "../channels/push";
import { sendEmail } from "../channels/email";

export const notificationQueue = new Queue("notifications", {
  connection: redisConnectionOptions,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 200,
  },
});

export const notificationWorker = new Worker(
  "notifications",
  async (job) => {
    const { notificationId } = job.data;
    const notification = await Notification.findById(notificationId);
    if (!notification) throw new Error("Notification not found");

    await Notification.findByIdAndUpdate(notificationId, {
      status: "retrying",
      attempts: job.attemptsMade + 1,
    });

    getIO()
      .to(`tenant:${notification.tenantId}`)
      .emit("notification:update", {
        _id: notificationId,
        status: "retrying",
      });

    if (notification.channel === "email") await sendEmail(notification);
    if (notification.channel === "sms") await sendSms(notification);
    if (notification.channel === "push") await sendPush(notification);

    await Notification.findByIdAndUpdate(notificationId, {
      status: "sent",
      sentAt: new Date(),
    });

    getIO()
      .to(`tenant:${notification.tenantId}`)
      .emit("notification:update", {
        _id: notificationId,
        status: "sent",
        sentAt: new Date(),
      });

    if (notification.webhookUrl) {
      await axios.post(notification.webhookUrl, {
        notificationId,
        status: "sent",
        sentAt: new Date(),
      });
    }
  },
  { connection: redisConnectionOptions, concurrency: 10 }
);

notificationWorker.on("failed", async (job, err) => {
  if (!job) return;
  const { notificationId, tenantId } = job.data;

  if (job.attemptsMade >= 3) {
    await Notification.findByIdAndUpdate(notificationId, {
      status: "failed",
      failureReason: err.message,
    });

    getIO()
      .to(`tenant:${tenantId}`)
      .emit("notification:update", {
        _id: notificationId,
        status: "failed",
      });
  }
});