import { Router } from 'express';

import { ProductsService } from './products.service';

export const productsRouter = Router();
const service = new ProductsService();

productsRouter.get('/', async (req, res) => {
  const { q, category_id: categoryId, sort } = req.query;
  const products = await service.list({
    q: typeof q === 'string' ? q : undefined,
    categoryId: typeof categoryId === 'string' ? Number(categoryId) : undefined,
    sort: typeof sort === 'string' ? sort : undefined,
  });
  res.json(products);
});

productsRouter.get('/:id', async (req, res) => {
  const product = await service.findById(Number(req.params.id));
  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }
  res.json(product);
});
