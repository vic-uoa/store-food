import { Repository } from 'typeorm';

import { dataSource } from '../../database/data-source';
import { Product } from '../../database/entities/product.entity';
import { HttpException } from '../../common/filters/http-exception.filter';

export class ProductAdminService {
  private repo: Repository<Product>;

  constructor() {
    this.repo = dataSource.getRepository(Product);
  }

  list() {
    return this.repo.find({ order: { updatedAt: 'DESC' } });
  }

  async create(payload: {
    name: string;
    price: number;
    images?: string[];
    category_id?: number;
    stock: number;
    status: Product['status'];
    sort_order: number;
  }) {
    const product = this.repo.create({
      name: payload.name,
      price: payload.price.toFixed(2),
      imageUrls: payload.images ?? [],
      categoryId: payload.category_id,
      stock: payload.stock,
      status: payload.status,
      sortOrder: payload.sort_order,
    });
    return this.repo.save(product);
  }

  async update(id: number, payload: Partial<{ name: string; price: number; images: string[]; category_id?: number; stock: number; status: Product['status']; sort_order: number }>) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) {
      throw new HttpException(404, 'Product not found');
    }
    if (payload.name !== undefined) product.name = payload.name;
    if (payload.price !== undefined) product.price = payload.price.toFixed(2);
    if (payload.images !== undefined) product.imageUrls = payload.images;
    if (payload.category_id !== undefined) product.categoryId = payload.category_id;
    if (payload.stock !== undefined) product.stock = payload.stock;
    if (payload.status !== undefined) product.status = payload.status;
    if (payload.sort_order !== undefined) product.sortOrder = payload.sort_order;
    return this.repo.save(product);
  }

  async softDelete(id: number) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) {
      throw new HttpException(404, 'Product not found');
    }
    product.status = 'deleted';
    return this.repo.save(product);
  }
}
