import * as z from 'zod';

export const BalanceActivityTypeSchema = z.enum(['KARSA', 'DAILY_BONUS', 'PURCHASE', 'GIVEAWAY'])

export type BalanceActivityType = z.infer<typeof BalanceActivityTypeSchema>;