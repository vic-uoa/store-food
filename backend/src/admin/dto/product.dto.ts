import { z } from 'zod';

export const adminProductCreateSchema = z.object({
  name: z.string().min(1),
  price: z.number().nonnegative(),
  images: z.array(z.string().url()).optional().default([]),
  category_id: z.number().int().positive().optional(),
  stock: z.number().int().min(0).default(0),
  status: z.enum(['on_shelf', 'off_shelf', 'deleted']).default('off_shelf'),
  sort_order: z.number().int().min(0).default(0),
});

export const adminProductUpdateSchema = adminProductCreateSchema.partial();
