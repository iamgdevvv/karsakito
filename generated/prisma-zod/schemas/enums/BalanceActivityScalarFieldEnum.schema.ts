import * as z from 'zod';

export const BalanceActivityScalarFieldEnumSchema = z.enum(['id', 'type', 'token', 'tokenBefore', 'tokenAfter', 'tokenDailyBefore', 'tokenDailyAfter', 'description', 'createdAt', 'balanceId', 'senderId'])

export type BalanceActivityScalarFieldEnum = z.infer<typeof BalanceActivityScalarFieldEnumSchema>;