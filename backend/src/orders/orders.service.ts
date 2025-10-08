import dayjs from 'dayjs';
import { In, Repository } from 'typeorm';

import { dataSource } from '../database/data-source';
import { CartItem } from '../database/entities/cart-item.entity';
import { Order } from '../database/entities/order.entity';
import { OrderItem } from '../database/entities/order-item.entity';
import { PointsLedger } from '../database/entities/points-ledger.entity';
import { PointsRule } from '../database/entities/points-rule.entity';
import { Product } from '../database/entities/product.entity';
import { HttpException } from '../common/filters/http-exception.filter';
import { runOnce } from '../common/utils/idempotency';

export class OrdersService {
  private orderRepo: Repository<Order>;
  private orderItemRepo: Repository<OrderItem>;
  private cartRepo: Repository<CartItem>;
  private productRepo: Repository<Product>;
  private pointsRuleRepo: Repository<PointsRule>;
  private pointsLedgerRepo: Repository<PointsLedger>;

  constructor() {
    this.orderRepo = dataSource.getRepository(Order);
    this.orderItemRepo = dataSource.getRepository(OrderItem);
    this.cartRepo = dataSource.getRepository(CartItem);
    this.productRepo = dataSource.getRepository(Product);
    this.pointsRuleRepo = dataSource.getRepository(PointsRule);
    this.pointsLedgerRepo = dataSource.getRepository(PointsLedger);
  }

  list(userId: number) {
    return this.orderRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async detail(userId: number, orderId: number) {
    const order = await this.orderRepo.findOne({ where: { id: orderId, userId } });
    if (!order) {
      throw new HttpException(404, 'Order not found');
    }
    const items = await this.orderItemRepo.find({ where: { orderId: order.id } });
    return { ...order, items };
  }

  async create(userId: number, address: Record<string, unknown>) {
    const cartItems = await this.cartRepo.find({ where: { userId } });
    if (!cartItems.length) {
      throw new HttpException(400, 'Cart is empty');
    }

    const productIds = cartItems.map((item) => item.productId);
    const products = await this.productRepo.find({ where: { id: In(productIds) } });

    const items = cartItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product || product.status !== 'on_shelf') {
        throw new HttpException(400, 'Product unavailable');
      }
      return {
        productId: product.id,
        productName: product.name,
        price: Number(product.price),
        qty: item.qty,
      };
    });

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const order = this.orderRepo.create({
      orderNo: this.generateOrderNo(),
      userId,
      status: 'pending_payment',
      totalAmount: totalAmount.toFixed(2),
      payAmount: totalAmount.toFixed(2),
      payMethod: null,
      addressSnapshot: address,
    });
    await this.orderRepo.save(order);

    for (const item of items) {
      const orderItem = this.orderItemRepo.create({
        orderId: order.id,
        productId: item.productId,
        productName: item.productName,
        price: item.price.toFixed(2),
        qty: item.qty,
      });
      await this.orderItemRepo.save(orderItem);
    }

    await this.cartRepo.remove(cartItems);
    return order;
  }

  async cancel(userId: number, orderId: number) {
    const order = await this.orderRepo.findOne({ where: { id: orderId, userId } });
    if (!order || order.status !== 'pending_payment') {
      throw new HttpException(400, 'Cannot cancel order');
    }
    order.status = 'canceled';
    order.canceledAt = new Date();
    await this.orderRepo.save(order);
    return order;
  }

  async markPaid(orderNo: string, amount: number) {
    return runOnce(`order-paid-${orderNo}`, async () => {
      const order = await this.orderRepo.findOne({ where: { orderNo } });
      if (!order) {
        throw new HttpException(404, 'Order not found');
      }
      if (order.status === 'paid') {
        return order;
      }
      order.status = 'paid';
      order.payAmount = amount.toFixed(2);
      order.payMethod = 'wechatpay';
      order.paidAt = new Date();
      await this.orderRepo.save(order);

      await this.grantPoints(order);

      return order;
    });
  }

  async markShipped(orderId: number) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) {
      throw new HttpException(404, 'Order not found');
    }
    order.status = 'shipped';
    order.shippedAt = new Date();
    return this.orderRepo.save(order);
  }

  async markCompleted(orderId: number) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) {
      throw new HttpException(404, 'Order not found');
    }
    order.status = 'completed';
    order.completedAt = new Date();
    return this.orderRepo.save(order);
  }

  async grantPoints(order: Order) {
    const rule = await this.pointsRuleRepo.findOne({ where: { enabled: 1 } });
    if (!rule || !order.payAmount) {
      return;
    }
    const amount = Number(order.payAmount);
    const ratioAmount = Number(rule.ratioAmount);
    if (!ratioAmount || ratioAmount <= 0) {
      return;
    }
    const points = Math.floor(amount / ratioAmount) * rule.ratioPoint;
    if (points <= 0) {
      return;
    }
    const ledger = this.pointsLedgerRepo.create({
      userId: order.userId,
      delta: points,
      reason: 'paid_order',
      refId: order.orderNo,
    });
    await this.pointsLedgerRepo.save(ledger);
    await dataSource
      .createQueryBuilder()
      .update('users')
      .set({ points: () => `points + ${points}` })
      .where('id = :userId', { userId: order.userId })
      .execute();
  }

  private generateOrderNo() {
    return `WM${dayjs().format('YYYYMMDDHHmmss')}${Math.floor(Math.random() * 1000)}`;
  }
}
