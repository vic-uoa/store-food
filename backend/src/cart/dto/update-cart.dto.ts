import { z } from 'zod';

export const updateCartSchema = z.object({
  qty: z.number().int().min(1).max(99),
});

export type UpdateCartDto = z.infer<typeof updateCartSchema>;
