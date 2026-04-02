import mongoose, { Schema } from "mongoose";
import { ITemplate } from "../interfaces/interface";

const TemplateSchema = new Schema<ITemplate>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    channel: { type: String, enum: ["email", "sms", "push"], required: true },
    subject: String,
    blocks: [
      {
        id: String,
        type: { type: String, enum: ["text", "variable", "button", "divider"] },
        content: String,
        order: Number,
      },
    ],
    variables: [String],
  },
  { timestamps: true }
);

export const Template = mongoose.model<ITemplate>("Template", TemplateSchema);