import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("5000"),
  MONGODB_URI: z.string(),
  REDIS_URL: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  TWILIO_ACCOUNT_SID: z.string(),
  TWILIO_AUTH_TOKEN: z.string(),
  TWILIO_PHONE_NUMBER: z.string(),
  FIREBASE_PROJECT_ID: z.string(),
  CLIENT_URL: z.string().default("http://localhost:3000"),
});

export const env = envSchema.parse(process.env);

export const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const SendNotificationSchema = z.object({
  body: z.object({
    channel: z.enum(["email", "sms", "push"]),
    recipient: z.string().min(1),
    templateId: z.string().optional(),
    subject: z.string().optional(),
    body: z.string().min(1),
    variables: z.record(z.string()).optional(),
    webhookUrl: z.string().url().optional(),
    scheduledAt: z.string().datetime().optional(),
  })
});

export const BulkNotificationSchema = z.object({
  body: z.object({
    channel: z.enum(["email", "sms", "push"]),
    recipients: z.array(z.string()).min(1).max(1000),
    templateId: z.string(),
    variables: z.array(z.record(z.string())).optional(),
  })
});

export type SendNotificationDto = z.infer<typeof SendNotificationSchema>;
export type BulkNotificationDto = z.infer<typeof BulkNotificationSchema>;

export const TemplateBlockSchema = z.object({
    id: z.string(),
    type: z.enum(["text", "variable", "button", "divider"]),
    content: z.string(),
    order: z.number(),
});

export const CreateTemplateSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    channel: z.enum(["email", "sms", "push"]),
    subject: z.string().optional(),
    blocks: z.array(TemplateBlockSchema),
    variables: z.array(z.string()).optional(),
  }),
});

export const UpdateTemplateSchema = z.object({
  body: CreateTemplateSchema.shape.body.partial(),
});

export type TemplateBlock = z.infer<typeof TemplateBlockSchema>;
export type CreateTemplateDto = z.infer<typeof CreateTemplateSchema>;