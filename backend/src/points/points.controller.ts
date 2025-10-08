import { Router } from 'express';

import { authenticate, AuthenticatedRequest } from '../common/guards/auth.guard';
import { PointsService } from './points.service';

export const pointsRouter = Router();
const service = new PointsService();

pointsRouter.get('/me', authenticate('user'), async (req: AuthenticatedRequest, res) => {
  const data = await service.getBalance(req.user!.id);
  res.json(data);
});
