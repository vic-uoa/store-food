import { Router } from 'express';

import { authenticate, AuthenticatedRequest } from '../common/guards/auth.guard';
import { addCartSchema } from './dto/add-cart.dto';
import { updateCartSchema } from './dto/update-cart.dto';
import { CartService } from './cart.service';

export const cartRouter = Router();
const service = new CartService();

cartRouter.use(authenticate('user'));

cartRouter.get('/', async (req: AuthenticatedRequest, res) => {
  const cart = await service.getCart(req.user!.id);
  res.json(cart);
});

cartRouter.post('/', async (req: AuthenticatedRequest, res) => {
  const payload = addCartSchema.parse(req.body);
  const item = await service.addToCart(req.user!.id, payload.product_id, payload.qty);
  res.json(item);
});

cartRouter.patch('/:id', async (req: AuthenticatedRequest, res) => {
  const payload = updateCartSchema.parse(req.body);
  const item = await service.updateQty(req.user!.id, Number(req.params.id), payload.qty);
  res.json(item);
});

cartRouter.delete('/:id', async (req: AuthenticatedRequest, res) => {
  await service.remove(req.user!.id, Number(req.params.id));
  res.status(204).send();
});
