import { z } from 'zod';

export const createOrderSchema = z.object({
  address: z.record(z.any()).optional().default({}),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
