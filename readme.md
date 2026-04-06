# NotifyHub — Backend API

A production-ready multi-channel notification service API built with Node.js, Express, TypeScript, MongoDB, Redis, and BullMQ.

## Features

- **Multi-channel delivery** — Email (Nodemailer), SMS (Twilio), Push (Firebase FCM)
- **Queue-based architecture** — BullMQ + Redis with automatic retries and exponential backoff
- **Dead Letter Queue** — failed jobs tracked and logged after max retry attempts
- **Real-time updates** — Socket.io broadcasts live delivery status to connected clients
- **Multi-tenancy** — full tenant isolation via JWT auth and hashed API keys
- **Template engine** — Handlebars-based templates with variable interpolation
- **Rate limiting** — per-tenant rate limiting via Redis
- **Webhook callbacks** — POST delivery status to client URLs on success/failure
- **Swagger docs** — full interactive API documentation at `/api/docs`
- **Scheduled notifications** — delay delivery to a future time

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Queue | BullMQ + Redis |
| Real-time | Socket.io |
| Auth | JWT + Hashed API Keys |
| Email | Nodemailer |
| SMS | Twilio |
| Push | Firebase Admin SDK |
| Templates | Handlebars |
| Validation | Zod |
| Docs | Swagger / OpenAPI 3.0 |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB
- Redis

### Installation
```bash
git clone https://github.com/najmussakib2/Notification-system-backend
cd Notification-system-backend
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notification-saas
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret

SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_pass

TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

FIREBASE_PROJECT_ID=your_firebase_project
CLIENT_URL=http://localhost:3000
```

### Run with Docker
```bash
docker-compose up -d mongodb redis
npm run dev
```

### Run without Docker

Make sure MongoDB and Redis are running locally, then:
```bash
npm run dev
```

## API Documentation

Visit `http://localhost:5000/api/docs` for full interactive Swagger documentation.

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register account |
| POST | `/api/v1/auth/login` | Login and get JWT |
| GET | `/api/v1/auth/me` | Get current user |
| POST | `/api/v1/notifications/send` | Send single notification |
| POST | `/api/v1/notifications/bulk` | Bulk send |
| GET | `/api/v1/notifications` | List notifications |
| GET | `/api/v1/notifications/:id` | Get notification status |
| POST | `/api/v1/templates` | Create template |
| GET | `/api/v1/templates` | List templates |
| PUT | `/api/v1/templates/:id` | Update template |
| DELETE | `/api/v1/templates/:id` | Delete template |
| POST | `/api/v1/api-keys` | Create API key |
| GET | `/api/v1/api-keys` | List API keys |
| DELETE | `/api/v1/api-keys/:id` | Revoke API key |
| GET | `/api/v1/analytics/summary` | Delivery summary |
| GET | `/api/v1/analytics/trends` | 30-day trends |
| GET | `/api/v1/analytics/channels` | Channel breakdown |

### Project Structure
```bash
src/
├── app/
|   ├── builder/        # Query Builder for Query manipulation
|   ├── channels/       # Email, SMS, Push implementations
|   ├── config/         # DB, Redis, Swagger, env validation
|   ├── DB/             # auto Seed User Creation 
|   ├── errors/         # Error handling utils
|   ├── interface/      # Typescript Global interfaces
|   ├── middlewares/    # Auth, rate limiter, error handler
|   ├── modules/
|   |   ├── controllers/# Typescript interfaces for api
|   |   ├── interfaces/ # Typescript interfaces for api
|   |   ├── models/     # Mongoose schemas
|   |   ├── routes/     # Express routes for each api
|   |   ├── services/   # Business logic 
|   |   └── Zod/        # Zod validation schemas
|   ├── queues/         # BullMQ queue and workers
|   ├── routes/         # Express Global route handlers
|   └── utils/          # necessary utility functions
├── socket io/          # Socket.io server
├── app.ts              # Entry point
└── server.ts           # Database Connection point
```

> ⚠️ **Warning**
> Dont Forget to add uploads folder in the root.

## Architecture

Client → API Gateway → Notification Service → BullMQ Queue → Workers
↓
Email / SMS / Push Channels
↓
MongoDB (logs) + Webhook callback
Socket.io (real-time status)

## License

MIT