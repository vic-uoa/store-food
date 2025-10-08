import { z } from 'zod';

export const updateProfileSchema = z.object({
  nickname: z.string().min(1).max(20),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
