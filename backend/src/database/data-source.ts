import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { CartItem } from './entities/cart-item.entity';
import { Category } from './entities/category.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { PointsLedger } from './entities/points-ledger.entity';
import { PointsRule } from './entities/points-rule.entity';
import { Product } from './entities/product.entity';
import { User } from './entities/user.entity';

const entities = [User, Category, Product, CartItem, Order, OrderItem, PointsRule, PointsLedger];

const isTest = process.env.NODE_ENV === 'test' || process.env.DB_TYPE === 'sqlite';

export const dataSource = new DataSource(
  isTest
    ? {
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
        entities,
        logging: false,
      }
    : {
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'wemall',
        synchronize: false,
        logging: false,
        entities,
        migrations: [],
      },
);
