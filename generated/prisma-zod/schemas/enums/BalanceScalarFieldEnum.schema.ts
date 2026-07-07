import * as z from 'zod';

export const BalanceScalarFieldEnumSchema = z.enum(['userId', 'token', 'tokenDaily'])

export type BalanceScalarFieldEnum = z.infer<typeof BalanceScalarFieldEnumSchema>;