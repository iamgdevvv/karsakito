import * as z from 'zod';

export const BalanceSchema = z.object({
  userId: z.string(),
  token: z.number().int(),
  tokenDaily: z.number().int(),
});

export type BalanceType = z.infer<typeof BalanceSchema>;
