import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CreateTemplateSchema, UpdateTemplateSchema } from '../Zod/zod.schema';
import { TemplateControllers } from '../controllers/tamplate.controller';
import { auth, requireAuth } from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

/**
 * @swagger
 * /templates:
 *   post:
 *     summary: Create a template
 *     tags: [Templates]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Template'
 *     responses:
 *       201:
 *         description: Template created
 *   get:
 *     summary: List all templates
 *     tags: [Templates]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: channel
 *         schema:
 *           type: string
 *           enum: [email, sms, push]
 *     responses:
 *       200:
 *         description: List of templates
 */

/**
 * @swagger
 * /templates/{id}:
 *   get:
 *     summary: Get a template by ID
 *     tags: [Templates]
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
 *         description: Template details
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a template
 *     tags: [Templates]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Template'
 *     responses:
 *       200:
 *         description: Template updated
 *   delete:
 *     summary: Delete a template
 *     tags: [Templates]
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
 *         description: Template deleted
 */
const router = express.Router();
router.use(requireAuth);

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(CreateTemplateSchema),
  TemplateControllers.createTamplate,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.user),
  TemplateControllers.getTemplates,
);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  TemplateControllers.getTemplateById,
);

router.put(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(UpdateTemplateSchema),
  TemplateControllers.updateTemplate,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin),
  TemplateControllers.deleteTemplate,
);


export const TemplateRoutes = router;