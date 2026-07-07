import * as z from 'zod';

export const AuthScalarFieldEnumSchema = z.enum(['hash', 'updatedAt', 'userId'])

export type AuthScalarFieldEnum = z.infer<typeof AuthScalarFieldEnumSchema>;