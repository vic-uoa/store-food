import { z } from 'zod';

export const addCartSchema = z.object({
  product_id: z.number().int().positive(),
  qty: z.number().int().min(1).max(99),
});

export type AddCartDto = z.infer<typeof addCartSchema>;
