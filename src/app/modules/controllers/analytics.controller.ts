import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AnalyticsService } from "../services/analytics.service";

const summary = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await AnalyticsService.summary(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'notification summary retrieved successfully',
    data: result,
  });
});

const trends = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await AnalyticsService.trends(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'notification trends retrieved successfully',
    data: result,
  });
});

const channels = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await AnalyticsService.channels(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'notification channels retrieved successfully',
    data: result,
  });
});

export const AnalyticsControllers = {
    summary,
    trends,
    channels,
}