import type { Express } from 'express';
import request from 'supertest';

import { createServer } from '../src/app/app';
import { dataSource } from '../src/database/data-source';
import { Product } from '../src/database/entities/product.entity';
import { PointsRule } from '../src/database/entities/points-rule.entity';

describe('WeMall API', () => {
  let app: Express.Application;
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    app = await createServer();
  });

  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('should login via wechat mock', async () => {
    const res = await request(app)
      .post('/auth/wechat/login')
      .send({ code: 'abc', encryptedData: 'enc', iv: 'iv' })
      .expect(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
  });

  it('should create order and handle payment notify', async () => {
    const login = await request(app)
      .post('/auth/wechat/login')
      .send({ code: 'abc2', encryptedData: 'enc', iv: 'iv' });
    const token = login.body.token;
    const userId = login.body.user.id;

    const productRepo = dataSource.getRepository(Product);
    await productRepo.save(
      productRepo.create({
        name: '测试商品',
        price: '100.00',
        stock: 100,
        sortOrder: 0,
        status: 'on_shelf',
      }),
    );

    const ruleRepo = dataSource.getRepository(PointsRule);
    await ruleRepo.save(
      ruleRepo.create({
        ratioAmount: '10.00',
        ratioPoint: 1,
        enabled: 1,
      }),
    );

    const product = await productRepo.findOneByOrFail({ name: '测试商品' });

    await request(app)
      .post('/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ product_id: product.id, qty: 1 })
      .expect(200);

    const orderRes = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ address: { contact: '张三' } })
      .expect(200);

    expect(orderRes.body.status).toBe('pending_payment');

    await request(app)
      .post('/pay/wechat/notify')
      .send({ orderNo: orderRes.body.orderNo, amount: 100, signature: 'mock' })
      .expect(200);

    const orderDetail = await request(app)
      .get(`/orders/${orderRes.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(orderDetail.body.status).toBe('paid');

    const points = await request(app)
      .get('/points/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(points.body.balance).toBeGreaterThan(0);
    expect(points.body.history.length).toBeGreaterThan(0);

    expect(userId).toBeGreaterThan(0);
  });
});
