import { Repository } from 'typeorm';

import { dataSource } from '../database/data-source';
import { CartItem } from '../database/entities/cart-item.entity';
import { Product } from '../database/entities/product.entity';
import { HttpException } from '../common/filters/http-exception.filter';

const MAX_QTY = 99;

export class CartService {
  private cartRepo: Repository<CartItem>;
  private productRepo: Repository<Product>;

  constructor() {
    this.cartRepo = dataSource.getRepository(CartItem);
    this.productRepo = dataSource.getRepository(Product);
  }

  async getCart(userId: number) {
    const items = await this.cartRepo.find({ where: { userId } });
    const detailed = await Promise.all(
      items.map(async (item) => {
        const product = await this.productRepo.findOne({ where: { id: item.productId } });
        return {
          ...item,
          product,
          subtotal: product ? Number(product.price) * item.qty : 0,
        };
      }),
    );
    const total = detailed.reduce((sum, item) => sum + item.subtotal, 0);
    return { items: detailed, total };
  }

  async addToCart(userId: number, productId: number, qty: number) {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product || product.status !== 'on_shelf') {
      throw new HttpException(400, 'Product unavailable');
    }
    const existing = await this.cartRepo.findOne({ where: { userId, productId } });
    if (existing) {
      const newQty = Math.min(existing.qty + qty, MAX_QTY);
      existing.qty = newQty;
      return this.cartRepo.save(existing);
    }
    const item = this.cartRepo.create({ userId, productId, qty: Math.min(qty, MAX_QTY) });
    return this.cartRepo.save(item);
  }

  async updateQty(userId: number, itemId: number, qty: number) {
    if (qty < 1 || qty > MAX_QTY) {
      throw new HttpException(400, 'Invalid quantity');
    }
    const item = await this.cartRepo.findOne({ where: { id: itemId, userId } });
    if (!item) {
      throw new HttpException(404, 'Cart item not found');
    }
    item.qty = qty;
    return this.cartRepo.save(item);
  }

  async remove(userId: number, itemId: number) {
    const item = await this.cartRepo.findOne({ where: { id: itemId, userId } });
    if (!item) {
      throw new HttpException(404, 'Cart item not found');
    }
    await this.cartRepo.remove(item);
  }
}
