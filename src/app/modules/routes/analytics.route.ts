import express from 'express';
import { AnalyticsControllers } from '../controllers/analytics.controller';
import { auth, requireAuth } from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

/**
 * @swagger
 * /analytics/summary:
 *   get:
 *     summary: Get delivery summary stats
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics summary
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsSummary'
 *
 * /analytics/trends:
 *   get:
 *     summary: Get daily trends for last 30 days
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Daily trend data
 *
 * /analytics/channels:
 *   get:
 *     summary: Get channel breakdown stats
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Channel breakdown
 */
const router = express.Router();
router.use(requireAuth);

router.get(
  '/summary',
  auth(
    USER_ROLE.admin,
    USER_ROLE.user,
  ),
  AnalyticsControllers.summary,
);

router.get(
  '/trends',
  auth(    
    USER_ROLE.admin,
    USER_ROLE.user
  ),
  AnalyticsControllers.trends,
);

router.get(
  '/channels',
  auth(
    USER_ROLE.admin,
    USER_ROLE.user
  ),
  AnalyticsControllers.channels,
);

export const AnalyticsRoutes = router;