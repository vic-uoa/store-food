import { Repository } from 'typeorm';

import { dataSource } from '../../database/data-source';
import { Category } from '../../database/entities/category.entity';
import { HttpException } from '../../common/filters/http-exception.filter';

export class CategoryAdminService {
  private repo: Repository<Category>;

  constructor() {
    this.repo = dataSource.getRepository(Category);
  }

  list() {
    return this.repo.find({ order: { sortOrder: 'ASC' } });
  }

  create(payload: { name: string; parent_id?: number | null; sort_order: number }) {
    const category = this.repo.create({
      name: payload.name,
      parentId: payload.parent_id ?? null,
      sortOrder: payload.sort_order,
    });
    return this.repo.save(category);
  }

  async update(id: number, payload: Partial<{ name: string; parent_id?: number | null; sort_order: number }>) {
    const category = await this.repo.findOne({ where: { id } });
    if (!category) {
      throw new HttpException(404, 'Category not found');
    }
    if (payload.name !== undefined) category.name = payload.name;
    if (payload.parent_id !== undefined) category.parentId = payload.parent_id;
    if (payload.sort_order !== undefined) category.sortOrder = payload.sort_order;
    return this.repo.save(category);
  }
}
