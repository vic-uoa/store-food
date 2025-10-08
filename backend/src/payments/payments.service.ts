import { Repository } from 'typeorm';

import { dataSource } from '../database/data-source';
import { Order } from '../database/entities/order.entity';
import { HttpException } from '../common/filters/http-exception.filter';
import { createMockPrepay, verifyMockSignature } from '../common/utils/wechatpay';
import { OrdersService } from '../orders/orders.service';

export class PaymentsService {
  private orderRepo: Repository<Order>;
  private ordersService: OrdersService;

  constructor() {
    this.orderRepo = dataSource.getRepository(Order);
    this.ordersService = new OrdersService();
  }

  async prepay(userId: number, orderId: number) {
    const order = await this.orderRepo.findOne({ where: { id: orderId, userId } });
    if (!order || order.status !== 'pending_payment') {
      throw new HttpException(400, 'Invalid order state');
    }
    const amount = Number(order.payAmount ?? order.totalAmount);
    const payload = createMockPrepay(order.orderNo, amount);
    return {
      prepay_id: payload.prepayId,
      nonceStr: payload.nonceStr,
      timestamp: payload.timestamp,
      signType: payload.signType,
      paySign: payload.paySign,
      mchId: payload.mchId,
    };
  }

  async handleNotify(data: { orderNo: string; amount: number; signature: string }) {
    if (!verifyMockSignature()) {
      throw new HttpException(400, 'Invalid signature');
    }
    await this.ordersService.markPaid(data.orderNo, data.amount);
    return { status: 'SUCCESS' };
  }
}
