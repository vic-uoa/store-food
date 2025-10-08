import { Router } from 'express';

import { authenticate, AuthenticatedRequest } from '../common/guards/auth.guard';
import { updateProfileSchema } from './dto/update-profile.dto';
import { UsersService } from './users.service';

export const usersRouter = Router();
const service = new UsersService();

usersRouter.get('/me', authenticate('user'), async (req: AuthenticatedRequest, res) => {
  const user = await service.findById(req.user!.id);
  res.json(user);
});

usersRouter.patch('/me/profile', authenticate('user'), async (req: AuthenticatedRequest, res) => {
  const payload = updateProfileSchema.parse(req.body);
  await service.updateNickname(req.user!.id, payload.nickname);
  res.json({ message: 'OK' });
});
