import { Router } from 'express';

import { authenticate, AuthenticatedRequest } from '../../common/guards/auth.guard';
import { adminProductCreateSchema, adminProductUpdateSchema } from '../dto/product.dto';
import { adminCategorySchema } from '../dto/category.dto';
import { adminPointsRuleSchema } from '../dto/points-rule.dto';
import { ProductAdminService } from '../services/product-admin.service';
import { CategoryAdminService } from '../services/category-admin.service';
import { PointsRuleAdminService } from '../services/points-rule-admin.service';
import { OrderAdminService } from '../services/order-admin.service';

export const adminRouter = Router();
const productService = new ProductAdminService();
const categoryService = new CategoryAdminService();
const pointsService = new PointsRuleAdminService();
const orderService = new OrderAdminService();

adminRouter.use(authenticate('admin'));

adminRouter.get('/products', async (_req: AuthenticatedRequest, res) => {
  const products = await productService.list();
  res.json(products);
});

adminRouter.post('/products', async (req: AuthenticatedRequest, res) => {
  const payload = adminProductCreateSchema.parse(req.body);
  const product = await productService.create(payload);
  res.status(201).json(product);
});

adminRouter.get('/products/:id', async (req: AuthenticatedRequest, res) => {
  const products = await productService.list();
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }
  res.json(product);
});

adminRouter.patch('/products/:id', async (req: AuthenticatedRequest, res) => {
  const payload = adminProductUpdateSchema.parse(req.body);
  const product = await productService.update(Number(req.params.id), payload);
  res.json(product);
});

adminRouter.delete('/products/:id', async (req: AuthenticatedRequest, res) => {
  await productService.softDelete(Number(req.params.id));
  res.status(204).send();
});

adminRouter.get('/categories', async (_req: AuthenticatedRequest, res) => {
  const categories = await categoryService.list();
  res.json(categories);
});

adminRouter.post('/categories', async (req: AuthenticatedRequest, res) => {
  const payload = adminCategorySchema.parse(req.body);
  const category = await categoryService.create(payload);
  res.status(201).json(category);
});

adminRouter.patch('/categories/:id', async (req: AuthenticatedRequest, res) => {
  const payload = adminCategorySchema.partial().parse(req.body);
  const category = await categoryService.update(Number(req.params.id), payload);
  res.json(category);
});

adminRouter.get('/orders', async (_req: AuthenticatedRequest, res) => {
  const orders = await orderService.list();
  res.json(orders);
});

adminRouter.get('/orders/:id', async (req: AuthenticatedRequest, res) => {
  const order = await orderService.detail(Number(req.params.id));
  res.json(order);
});

adminRouter.post('/orders/:id/ship', async (req: AuthenticatedRequest, res) => {
  const order = await orderService.markShipped(Number(req.params.id), req.body?.remark);
  res.json(order);
});

adminRouter.get('/points-rules', async (_req: AuthenticatedRequest, res) => {
  const rules = await pointsService.list();
  res.json(rules);
});

adminRouter.post('/points-rules', async (req: AuthenticatedRequest, res) => {
  const payload = adminPointsRuleSchema.parse(req.body);
  const rule = await pointsService.create(payload);
  res.status(201).json(rule);
});

adminRouter.patch('/points-rules/:id', async (req: AuthenticatedRequest, res) => {
  const payload = adminPointsRuleSchema.partial().parse(req.body);
  const rule = await pointsService.update(Number(req.params.id), payload);
  res.json(rule);
});
