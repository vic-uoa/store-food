import { Router } from 'express';

import { wechatLoginSchema } from './dto/wechat-login.dto';
import { AuthService } from './auth.service';

export const authRouter = Router();
const service = new AuthService();

authRouter.post('/wechat/login', async (req, res) => {
  const payload = wechatLoginSchema.parse(req.body);
  const result = await service.wechatLogin(payload);
  res.json(result);
});

authRouter.post('/admin/mock-login', async (_req, res) => {
  const token = service.issueAdminToken();
  res.json({ token, role: 'admin' });
});
