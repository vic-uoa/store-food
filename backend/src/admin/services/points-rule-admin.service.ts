import { Repository } from 'typeorm';

import { dataSource } from '../../database/data-source';
import { PointsRule } from '../../database/entities/points-rule.entity';
import { HttpException } from '../../common/filters/http-exception.filter';

export class PointsRuleAdminService {
  private repo: Repository<PointsRule>;

  constructor() {
    this.repo = dataSource.getRepository(PointsRule);
  }

  list() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  create(payload: { ratio_amount: number; ratio_point: number; enabled?: boolean }) {
    const rule = this.repo.create({
      ratioAmount: payload.ratio_amount.toFixed(2),
      ratioPoint: payload.ratio_point,
      enabled: payload.enabled === false ? 0 : 1,
    });
    return this.repo.save(rule);
  }

  async update(id: number, payload: Partial<{ ratio_amount: number; ratio_point: number; enabled: boolean }>) {
    const rule = await this.repo.findOne({ where: { id } });
    if (!rule) {
      throw new HttpException(404, 'Rule not found');
    }
    if (payload.ratio_amount !== undefined) rule.ratioAmount = payload.ratio_amount.toFixed(2);
    if (payload.ratio_point !== undefined) rule.ratioPoint = payload.ratio_point;
    if (payload.enabled !== undefined) rule.enabled = payload.enabled ? 1 : 0;
    return this.repo.save(rule);
  }
}
