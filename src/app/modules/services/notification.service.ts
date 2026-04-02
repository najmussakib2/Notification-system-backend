/* eslint-disable @typescript-eslint/no-explicit-any */
import Handlebars from "handlebars";
import { Template } from "../models/Template";
import { Notification } from "../models/Notification";
import { getIO } from "../../../socket io/socket.io";
import { notificationQueue } from "../../queues/notificationQueue";
import { NotificationQuery } from "../interfaces/interface";

const sendNotification = async (tenantId: string, dto: any) => {
    let body = dto.body;
    let subject = dto.subject;

    // if templateId provided, compile Handlebars template
    if (dto.templateId) {
        const template = await Template.findOne({ _id: dto.templateId, tenantId });
        if (!template) throw { status: 404, message: "Template not found" };

        const bodySource = template.blocks
            .sort((a, b) => a.order - b.order)
            .map((b) => b.content)
            .join("\n");

        body = Handlebars.compile(bodySource)(dto.variables ?? {});
        subject = template.subject ?? subject;
    }

    const notification = await Notification.create({
        tenantId,
        channel: dto.channel,
        recipient: dto.recipient,
        subject,
        body,
        status: "queued",
        webhookUrl: dto.webhookUrl,
    });

    const job = await notificationQueue.add(
        "send",
        { notificationId: notification._id.toString(), tenantId },
        dto.scheduledAt ? { delay: new Date(dto.scheduledAt).getTime() - Date.now() } : {}
    );

    await Notification.findByIdAndUpdate(notification._id, { jobId: job.id });

    // emit to dashboard immediately
    getIO()
        .to(`tenant:${tenantId}`)
        .emit("notification:new", { ...notification.toObject(), status: "queued" });

    return notification;
}
const sendBulkNotifications = async (
    tenantId: string,
    dto: any
) => {
    const template = await Template.findOne({ _id: dto.templateId, tenantId });
    if (!template) throw { status: 404, message: "Template not found" };

    const notifications = await Promise.all(
        dto.recipients.map(async (recipient: any, i:number) => {
            const vars = dto.variables?.[i] ?? {};
            const bodySource = template.blocks
                .sort((a, b) => a.order - b.order)
                .map((b) => b.content)
                .join("\n");

            const body = Handlebars.compile(bodySource)(vars);

            const notification = await Notification.create({
                tenantId,
                channel: dto.channel,
                recipient,
                subject: template.subject,
                body,
                status: "queued",
            });

            await notificationQueue.add("send", {
                notificationId: notification._id.toString(),
                tenantId,
            });

            return notification;
        })
    );

    return { queued: notifications.length };
};

const getNotifications = async (query: NotificationQuery, tenantId: string) => {
    const { page = 1, limit = 20, status, channel } = query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { tenantId: tenantId };
    if (status) filter.status = status;
    if (channel) filter.channel = channel;

    const [data, total] = await Promise.all([
        Notification.find(filter)
            .sort({ createdAt: -1 })
            .skip((+page - 1) * +limit)
            .limit(+limit),
        Notification.countDocuments(filter),
    ]);

    const meta = {
      total,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(total / +limit),
    }
    return { data, meta };
};

const getNotificationById = async (id: string, tenantId: string) => {
    const notification = await Notification.findOne({
        _id: id,
        tenantId,
    });
    if (!notification) throw { status: 404, message: "Not found" };
    return notification;
}

export const NotificationService = {
    sendNotification,
    sendBulkNotifications,
    getNotifications,
    getNotificationById,

}