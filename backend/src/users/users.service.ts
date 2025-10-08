import { Repository } from 'typeorm';

import { dataSource } from '../database/data-source';
import { User } from '../database/entities/user.entity';
import { HttpException } from '../common/filters/http-exception.filter';

export class UsersService {
  private userRepo: Repository<User>;

  constructor() {
    this.userRepo = dataSource.getRepository(User);
  }

  async findById(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(404, 'User not found');
    }
    return user;
  }

  async updateNickname(id: number, nickname: string) {
    const user = await this.findById(id);
    user.nickname = nickname;
    return this.userRepo.save(user);
  }
}
