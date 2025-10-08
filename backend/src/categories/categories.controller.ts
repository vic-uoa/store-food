import { Router } from 'express';

import { CategoriesService } from './categories.service';

export const categoriesRouter = Router();
const service = new CategoriesService();

categoriesRouter.get('/', async (_req, res) => {
  const categories = await service.list();
  res.json(categories);
});
