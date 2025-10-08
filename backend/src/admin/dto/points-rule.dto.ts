import { z } from 'zod';

export const adminPointsRuleSchema = z.object({
  ratio_amount: z.number().positive(),
  ratio_point: z.number().int().positive(),
  enabled: z.boolean().optional(),
});
