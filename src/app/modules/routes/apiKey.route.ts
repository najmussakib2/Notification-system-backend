import express from 'express';
import { ApiKeyControllers } from '../controllers/apiKey.controller';
import {auth, requireAuth} from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

/**
 * @swagger
 * /api-keys:
 *   post:
 *     summary: Create a new API key
 *     tags: [API Keys]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiKey'
 *     responses:
 *       201:
 *         description: API key created — raw key returned only once
 *   get:
 *     summary: List all API keys (masked)
 *     tags: [API Keys]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of masked API keys
 *
 * /api-keys/{id}:
 *   delete:
 *     summary: Revoke an API key
 *     tags: [API Keys]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: API key revoked
 *       404:
 *         description: Key not found
 */
const router = express.Router();
router.use(requireAuth);

router.post(
  '/',
  auth(USER_ROLE.admin),
  ApiKeyControllers.createApiKey,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.user),
  ApiKeyControllers.getApiKeys,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin),
  ApiKeyControllers.deleteApiKey,
);

export const ApiKeyRoutes = router;