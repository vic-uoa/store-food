import { Repository } from 'typeorm';

import { dataSource } from '../../database/data-source';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { HttpException } from '../../common/filters/http-exception.filter';

export class OrderAdminService {
  private orderRepo: Repository<Order>;
  private itemRepo: Repository<OrderItem>;

  constructor() {
    this.orderRepo = dataSource.getRepository(Order);
    this.itemRepo = dataSource.getRepository(OrderItem);
  }

  list() {
    return this.orderRepo.find({ order: { createdAt: 'DESC' } });
  }

  async detail(id: number) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new HttpException(404, 'Order not found');
    }
    const items = await this.itemRepo.find({ where: { orderId: id } });
    return { ...order, items };
  }

  async markShipped(id: number, remark?: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new HttpException(404, 'Order not found');
    }
    if (order.status !== 'paid') {
      throw new HttpException(400, 'Only paid orders can be shipped');
    }
    order.status = 'shipped';
    order.shippedAt = new Date();
    order.addressSnapshot = {
      ...(order.addressSnapshot || {}),
      remark,
    };
    return this.orderRepo.save(order);
  }
}
