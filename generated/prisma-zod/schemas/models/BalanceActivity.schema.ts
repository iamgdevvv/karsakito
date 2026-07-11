import * as z from 'zod';
import { BalanceActivityTypeSchema } from '../enums/BalanceActivityType.schema';

export const BalanceActivitySchema = z.object({
  id: z.string(),
  type: BalanceActivityTypeSchema,
  token: z.number().int(),
  tokenBefore: z.number().int(),
  tokenAfter: z.number().int(),
  tokenDailyBefore: z.number().int(),
  tokenDailyAfter: z.number().int(),
  description: z.string().nullish(),
  createdAt: z.date(),
  balanceId: z.string(),
  senderId: z.string().nullish(),
});

export type BalanceActivityType = z.infer<typeof BalanceActivitySchema>;
