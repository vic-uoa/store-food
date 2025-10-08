import { Repository } from 'typeorm';

import { dataSource } from '../database/data-source';
import { Category } from '../database/entities/category.entity';

export class CategoriesService {
  private repo: Repository<Category>;

  constructor() {
    this.repo = dataSource.getRepository(Category);
  }

  list() {
    return this.repo.find({ order: { sortOrder: 'ASC', id: 'ASC' } });
  }
}
