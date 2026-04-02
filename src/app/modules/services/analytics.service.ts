import AppError from "../../errors/AppError";
import { Notification } from "../models/Notification";

const summary = async (tenantId: string) => {
    const [total, sent, failed, pending, byChannel] = await Promise.all([
        Notification.countDocuments({ tenantId }),
        Notification.countDocuments({ tenantId, status: "sent" }),
        Notification.countDocuments({ tenantId, status: "failed" }),
        Notification.countDocuments({ tenantId, status: "pending" }),
        Notification.aggregate([
            { $match: { tenantId } },
            { $group: { _id: "$channel", count: { $sum: 1 } } },
        ]),
    ]);

    const channelMap = byChannel.reduce(
        (acc, item) => ({ ...acc, [item._id]: item.count }),
        {}
    );

    return {
        total,
        sent,
        failed,
        pending,
        byChannel: channelMap,
        deliveryRate: total > 0 ? Math.round((sent / total) * 100) : 0,
    };
}
const trends = async (tenantId: string) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trends = await Notification.aggregate([
        {
            $match: {
                tenantId: tenantId,
                createdAt: { $gte: thirtyDaysAgo },
            },
        },
        {
            $group: {
                _id: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    status: "$status",
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { "_id.date": 1 } },
    ]);

    if (!trends) {
        throw new AppError(501, "Not implemented yet");
    }

    return trends;
}
const channels = async  (tenantId: string) => {
    const breakdown = await Notification.aggregate([
        { $match: { tenantId: tenantId } },
        {
            $group: {
                _id: { channel: "$channel", status: "$status" },
                count: { $sum: 1 },
            },
        },
    ]);
    if (!breakdown) {
        throw new AppError(501, "Not implemented yet");
    }
    return breakdown;
}

export const AnalyticsService = {
    summary,
    trends,
    channels,
}