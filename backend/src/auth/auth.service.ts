import jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';

import { dataSource } from '../database/data-source';
import { User } from '../database/entities/user.entity';
import { getConfig } from '../config/config';
import { exchangeCodeForSession, decryptPhoneNumber } from '../common/utils/wechat';
import { HttpException } from '../common/filters/http-exception.filter';

export class AuthService {
  private userRepo: Repository<User>;

  constructor() {
    this.userRepo = dataSource.getRepository(User);
  }

  async wechatLogin(payload: { code: string; encryptedData: string; iv: string }) {
    const session = await exchangeCodeForSession(payload.code);
    const phoneInfo = decryptPhoneNumber(session.sessionKey, payload.encryptedData, payload.iv);
    if (!phoneInfo.phoneNumber) {
      throw new HttpException(400, 'Unable to decrypt phone number');
    }

    let user = await this.userRepo.findOne({ where: { phone: phoneInfo.phoneNumber } });
    if (!user) {
      user = this.userRepo.create({
        openid: session.openid,
        phone: phoneInfo.phoneNumber,
        nickname: '未命名家长',
        points: 0,
        status: 1,
      });
    } else if (user.status !== 1) {
      throw new HttpException(403, 'User disabled');
    }

    await this.userRepo.save(user);
    const token = jwt.sign({ sub: user.id, role: 'user' }, getConfig().jwtSecret, {
      expiresIn: getConfig().jwtExpiresIn,
    });

    return {
      token,
      user,
    };
  }

  issueAdminToken() {
    return jwt.sign({ sub: 0, role: 'admin' }, getConfig().jwtSecret, {
      expiresIn: getConfig().jwtExpiresIn,
    });
  }
}
