/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';
import { auth } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { upload } from '../../utils/sendImageToCloudinary';
import { USER_ROLE } from './user.constant';
import { UserControllers } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Account created successfully
 *       409:
 *         description: Email already in use
 */
router.post(
  '/register',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    console.log(req.body);
    next();
  },
  validateRequest(UserValidation.createUserValidationShema),
  UserControllers.createUser,
);

router.post(
  '/change-status/:id',
  auth(),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns current user info
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/me',
  auth(

    USER_ROLE.admin,
    USER_ROLE.user,
  ),
  UserControllers.getMe,
);

export const UserRoutes = router;
