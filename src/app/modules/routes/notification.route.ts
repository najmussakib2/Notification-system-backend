import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BulkNotificationSchema, SendNotificationSchema } from '../Zod/zod.schema';
import { NotificationControllers } from '../controllers/notification.controller';
import { auth, requireAuthOrApiKey } from '../../middlewares/auth';
import { apiRateLimiter } from '../../middlewares/rateLimiter';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();
router.use(requireAuthOrApiKey, apiRateLimiter);

/**
 * @swagger
 * /notifications/send:
 *   post:
 *     summary: Send a single notification
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendNotification'
 *     responses:
 *       201:
 *         description: Notification queued successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationLog'
 *       400:
 *         description: Validation error
 */
router.post(
  '/send',
  validateRequest(SendNotificationSchema),
  auth(
    USER_ROLE.admin,
    USER_ROLE.user
  ),
  NotificationControllers.sendNotification,
);

/**
 * @swagger
 * /notifications/bulk:
 *   post:
 *     summary: Send bulk notifications
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkNotification'
 *     responses:
 *       201:
 *         description: Bulk notifications queued
 */
router.post(
  '/bulk',
  validateRequest(BulkNotificationSchema),
  auth(USER_ROLE.admin),
  NotificationControllers.sendBulkNotifications,
);
/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: List notifications with filters
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, queued, sent, failed, retrying]
 *       - in: query
 *         name: channel
 *         schema:
 *           type: string
 *           enum: [email, sms, push]
 *     responses:
 *       200:
 *         description: Paginated list of notifications
 */
router.get(
  '/',
  auth(
    USER_ROLE.admin,
    USER_ROLE.user
  ),
  NotificationControllers.getNotifications,
);


/**
 * @swagger
 * /notifications/{id}:
 *   get:
 *     summary: Get notification status by ID
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationLog'
 *       404:
 *         description: Not found
 */
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  NotificationControllers.getNotificationById,
);

export const NotificationRoutes = router;