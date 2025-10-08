import { Router } from 'express';

import { authenticate, AuthenticatedRequest } from '../common/guards/auth.guard';
import { createOrderSchema } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

export const ordersRouter = Router();
const service = new OrdersService();

ordersRouter.use(authenticate('user'));

ordersRouter.post('/', async (req: AuthenticatedRequest, res) => {
  const payload = createOrderSchema.parse(req.body ?? {});
  const order = await service.create(req.user!.id, payload.address ?? {});
  res.json(order);
});

ordersRouter.get('/', async (req: AuthenticatedRequest, res) => {
  const orders = await service.list(req.user!.id);
  res.json(orders);
});

ordersRouter.get('/:id', async (req: AuthenticatedRequest, res) => {
  const order = await service.detail(req.user!.id, Number(req.params.id));
  res.json(order);
});

ordersRouter.delete('/:id', async (req: AuthenticatedRequest, res) => {
  const order = await service.cancel(req.user!.id, Number(req.params.id));
  res.json(order);
});
