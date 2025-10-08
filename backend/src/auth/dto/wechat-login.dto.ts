import { z } from 'zod';

export const wechatLoginSchema = z.object({
  code: z.string().min(1),
  encryptedData: z.string().min(1),
  iv: z.string().min(1),
});

export type WechatLoginDto = z.infer<typeof wechatLoginSchema>;
