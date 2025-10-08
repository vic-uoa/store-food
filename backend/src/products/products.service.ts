import { Repository } from 'typeorm';

import { dataSource } from '../database/data-source';
import { Product } from '../database/entities/product.entity';

export class ProductsService {
  private repo: Repository<Product>;

  constructor() {
    this.repo = dataSource.getRepository(Product);
  }

  async list(params: { q?: string; categoryId?: number; sort?: string }) {
    const qb = this.repo.createQueryBuilder('product').where('product.status = :status', {
      status: 'on_shelf',
    });

    if (params.q) {
      qb.andWhere('product.name LIKE :q', { q: `%${params.q}%` });
    }

    if (params.categoryId) {
      qb.andWhere('product.category_id = :categoryId', { categoryId: params.categoryId });
    }

    if (params.sort === 'price_asc') {
      qb.orderBy('product.price', 'ASC');
    } else if (params.sort === 'price_desc') {
      qb.orderBy('product.price', 'DESC');
    } else if (params.sort === 'new') {
      qb.orderBy('product.created_at', 'DESC');
    } else {
      qb.orderBy('product.sort_order', 'ASC');
    }

    return qb.getMany();
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }
}
