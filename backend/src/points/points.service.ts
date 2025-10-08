import { Repository } from 'typeorm';

import { dataSource } from '../database/data-source';
import { PointsLedger } from '../database/entities/points-ledger.entity';
import { User } from '../database/entities/user.entity';
import { HttpException } from '../common/filters/http-exception.filter';

export class PointsService {
  private ledgerRepo: Repository<PointsLedger>;
  private userRepo: Repository<User>;

  constructor() {
    this.ledgerRepo = dataSource.getRepository(PointsLedger);
    this.userRepo = dataSource.getRepository(User);
  }

  async getBalance(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException(404, 'User not found');
    }
    const history = await this.ledgerRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
    return { balance: user.points, history };
  }
}
