import { z } from 'zod';

export const adminCategorySchema = z.object({
  name: z.string().min(1),
  parent_id: z.number().int().positive().nullable().optional(),
  sort_order: z.number().int().min(0).default(0),
});
