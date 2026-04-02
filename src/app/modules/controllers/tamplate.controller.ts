import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TemplateService } from "../services/tamplate.service";

const createTamplate = catchAsync(async (req, res) => {
  const result = await TemplateService.createTamplate(req.body, req.user.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Template created successfully!',
    data: result
  });
});

const getTemplates = catchAsync(async (req, res) => {
  const result = await TemplateService.getTemplates(req.query, req.user.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Templates retrieved successfully!',
    data: result
  });
});

const getTemplateById = catchAsync(async (req, res) => {
  const result = await TemplateService.getTemplateById(req.params.id, req.user.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Template retrieved successfully!',
    data: result
  });
});

const updateTemplate = catchAsync(async (req, res) => {
  const result = await TemplateService.updateTemplate(req.params.id, req.body, req.user.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Template updated successfully!',
    data: result
  });
});

const deleteTemplate = catchAsync(async (req, res) => {
  const result = await TemplateService.deleteTemplate(req.params.id, req.user.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Template deleted successfully!',
    data: result
  });
});

export const TemplateControllers = {
    createTamplate,
    getTemplates,
    getTemplateById,
    updateTemplate,
    deleteTemplate,
}