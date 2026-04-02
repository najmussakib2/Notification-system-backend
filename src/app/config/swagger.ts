import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NotifyHub API",
      version: "1.0.0",
      description: "Multi-channel notification service API",
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
        },
      },
      schemas: {
        SendNotification: {
          type: "object",
          required: ["channel", "recipient", "body"],
          properties: {
            channel: { type: "string", enum: ["email", "sms", "push"] },
            recipient: { type: "string", example: "user@example.com" },
            templateId: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d1" },
            subject: { type: "string", example: "Welcome!" },
            body: { type: "string", example: "Hello {{name}}, welcome aboard!" },
            variables: { type: "object", example: { name: "John" } },
            webhookUrl: { type: "string", example: "https://yourapp.com/webhook" },
            scheduledAt: { type: "string", example: "2025-01-01T10:00:00.000Z" },
          },
        },
        BulkNotification: {
          type: "object",
          required: ["channel", "recipients", "templateId"],
          properties: {
            channel: { type: "string", enum: ["email", "sms", "push"] },
            recipients: {
              type: "array",
              items: { type: "string" },
              example: ["user1@example.com", "user2@example.com"],
            },
            templateId: { type: "string" },
            variables: {
              type: "array",
              items: { type: "object" },
              example: [{ name: "John" }, { name: "Jane" }],
            },
          },
        },
        Template: {
          type: "object",
          required: ["name", "channel", "blocks"],
          properties: {
            name: { type: "string", example: "Welcome Email" },
            channel: { type: "string", enum: ["email", "sms", "push"] },
            subject: { type: "string", example: "Welcome to NotifyHub" },
            blocks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  type: { type: "string", enum: ["text", "variable", "button", "divider"] },
                  content: { type: "string" },
                  order: { type: "number" },
                },
              },
            },
            variables: {
              type: "array",
              items: { type: "string" },
              example: ["name", "otp"],
            },
          },
        },
        ApiKey: {
          type: "object",
          properties: {
            name: { type: "string", example: "Production Key" },
          },
        },
        NotificationLog: {
          type: "object",
          properties: {
            _id: { type: "string" },
            channel: { type: "string", enum: ["email", "sms", "push"] },
            recipient: { type: "string" },
            subject: { type: "string" },
            body: { type: "string" },
            status: {
              type: "string",
              enum: ["pending", "queued", "sent", "failed", "retrying"],
            },
            attempts: { type: "number" },
            sentAt: { type: "string" },
            failureReason: { type: "string" },
            createdAt: { type: "string" },
          },
        },
        AnalyticsSummary: {
          type: "object",
          properties: {
            total: { type: "number" },
            sent: { type: "number" },
            failed: { type: "number" },
            pending: { type: "number" },
            byChannel: {
              type: "object",
              properties: {
                email: { type: "number" },
                sms: { type: "number" },
                push: { type: "number" },
              },
            },
            deliveryRate: { type: "number" },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);