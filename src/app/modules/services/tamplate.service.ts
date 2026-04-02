/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Template } from "../models/Template";

const createTamplate = async (payload: any, tenantId: string) => {
    const template = await Template.create({ ...payload, tenantId });
    if (!template) throw new AppError(httpStatus.BAD_REQUEST, "Failed to create template");
    return template;
}
const getTemplates = async (query: any, tenantId: string) => {
    const { channel } = query;
    const filter: any = { tenantId };
    if (channel) filter.channel = channel;
    const templates = await Template.find(filter).sort({ createdAt: -1 });
    if (!templates) throw new AppError(500, "Failed to fetch templates");
    return templates;
}
const getTemplateById = async (id: string, tenantId: string) => {
    const template = await Template.findOne({
        _id: id,
        tenantId,
    });
    if (!template) throw new AppError(404, "Template not found");
    return template;
}
const updateTemplate = async (id: string, payload: any, tenantId: string) => {
    try {
        const template = await Template.findOneAndUpdate(
            { _id: id, tenantId: tenantId },
            payload,
            { new: true }
        );
        if (!template) throw new AppError(404, "Template not found");
        return template;
    } catch (err: any) {
        throw new AppError(400, err.message);
    }
}
const deleteTemplate = async (id: string, tenantId: string) => {
    const template = await Template.findOneAndDelete({
        _id: id,
        tenantId,
    });
    if (!template) throw new AppError(404, "Template not found");
    return template;
}

export const TemplateService = {
    createTamplate,
    getTemplates,
    getTemplateById,
    updateTemplate,
    deleteTemplate,
}