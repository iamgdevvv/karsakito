import * as z from 'zod';

export const KarsaScalarFieldEnumSchema = z.enum(['id', 'app', 'promptJson', 'result', 'reaction', 'feedback', 'createdAt', 'updatedAt', 'userId', 'balanceActivityId'])

export type KarsaScalarFieldEnum = z.infer<typeof KarsaScalarFieldEnumSchema>;