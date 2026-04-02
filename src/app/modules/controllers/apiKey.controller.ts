import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { ApiKeyService } from "../services/apiKey.service";

const createApiKey = catchAsync(async (req, res) => {
  const result = await ApiKeyService.createApiKey(req.body, req.user.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'API key created successfully!',
    data: result
  });
});

const getApiKeys = catchAsync(async (req, res) => {
  const result = await ApiKeyService.getApiKeys(req.user.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'API keys retrieved successfully!',
    data: result
  });
});

const deleteApiKey = catchAsync(async (req, res) => {
  const result = await ApiKeyService.deleteApiKey(req.params.id, req.user.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'API key deleted successfully!',
    data: result
  });
});        


export const ApiKeyControllers = {
    createApiKey,
    getApiKeys,
    deleteApiKey,
}