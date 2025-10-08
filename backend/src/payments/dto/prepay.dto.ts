import { z } from 'zod';

export const prepaySchema = z.object({
  order_id: z.number().int().positive(),
});

export type PrepayDto = z.infer<typeof prepaySchema>;
