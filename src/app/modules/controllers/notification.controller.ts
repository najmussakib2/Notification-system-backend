import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NotificationService } from "../services/notification.service";

const sendNotification = catchAsync(async (req, res) => {
  const result = await NotificationService.sendNotification(req.user.userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification sent successfully!',
    data: result
  });
});

const sendBulkNotifications = catchAsync(async (req, res) => {
  const result = await NotificationService.sendBulkNotifications(req.user.userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications sent successfully!',
    data: result
  });
});

const getNotifications = catchAsync(async (req, res) => {
  const result = await NotificationService.getNotifications(req.query, req.user.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications retrieved successfully!',
    data: result.data,
    meta: result.meta,
  });
});

const getNotificationById = catchAsync(async (req, res) => {
  const result = await NotificationService.getNotificationById(req.params.id, req.user.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification retrieved successfully!',
    data: result
  });
});

export const NotificationControllers = {
    sendNotification,
    sendBulkNotifications,
    getNotifications,
    getNotificationById,

}