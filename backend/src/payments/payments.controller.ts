import { Router } from 'express';

import { authenticate, AuthenticatedRequest } from '../common/guards/auth.guard';
import { OrdersService } from '../orders/orders.service';
import { prepaySchema } from './dto/prepay.dto';
import { PaymentsService } from './payments.service';

export const paymentsRouter = Router();
const service = new PaymentsService();
const ordersService = new OrdersService();

paymentsRouter.post('/wechat/prepay', authenticate('user'), async (req: AuthenticatedRequest, res) => {
  const payload = prepaySchema.parse(req.body);
  const data = await service.prepay(req.user!.id, payload.order_id);
  res.json(data);
});

paymentsRouter.post('/wechat/notify', async (req, res) => {
  const body = req.body || {};
  const data = await service.handleNotify({
    orderNo: body.orderNo,
    amount: Number(body.amount || 0),
    signature: body.signature || '',
  });
  res.json(data);
});

paymentsRouter.post('/orders/:id/complete', authenticate('user'), async (req: AuthenticatedRequest, res) => {
  const order = await ordersService.markCompleted(Number(req.params.id));
  res.json(order);
});
