import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { AnalyticsRoutes } from '../modules/routes/analytics.route';
import { ApiKeyRoutes } from '../modules/routes/apiKey.route';
import { NotificationRoutes } from '../modules/routes/notification.route';
import { TemplateRoutes } from '../modules/routes/tamplate.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
  
  {
    path: '/templates',
    route: TemplateRoutes,
  },

  {
    path: '/analytics',
    route: AnalyticsRoutes,
  },
  
  {
    path: '/api-keys',
    route: ApiKeyRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
