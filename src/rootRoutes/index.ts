import { Router } from 'express';

interface Route {
  path: string;
  route: Router;
}

const router = Router();

// Legacy routes
const RootRouter: Route[] = [
  // {
  //   path: '/auth',
  //   route: AuthRouter,
  // },
];

// Register legacy routes
RootRouter.forEach((route: Route) => router.use(route.path, route.route));

export default router;