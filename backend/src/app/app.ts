import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';

import { loadConfig } from '../config/config';
import { dataSource } from '../database/data-source';
import { errorHandler } from '../common/filters/http-exception.filter';
import { requestLogger } from '../common/middleware/request-logger';
import { authRouter } from '../auth/auth.controller';
import { usersRouter } from '../users/users.controller';
import { categoriesRouter } from '../categories/categories.controller';
import { productsRouter } from '../products/products.controller';
import { cartRouter } from '../cart/cart.controller';
import { ordersRouter } from '../orders/orders.controller';
import { paymentsRouter } from '../payments/payments.controller';
import { pointsRouter } from '../points/points.controller';
import { adminRouter } from '../admin/controllers/admin.controller';

export async function createServer() {
  loadConfig();
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('combined'));
  app.use(requestLogger);

  app.use('/auth', authRouter);
  app.use('/users', usersRouter);
  app.use('/categories', categoriesRouter);
  app.use('/products', productsRouter);
  app.use('/cart', cartRouter);
  app.use('/orders', ordersRouter);
  app.use('/pay', paymentsRouter);
  app.use('/points', pointsRouter);
  app.use('/admin', adminRouter);

  app.use(errorHandler);

  return app;
}
