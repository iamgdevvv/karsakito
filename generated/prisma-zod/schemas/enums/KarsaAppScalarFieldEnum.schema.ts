import * as z from 'zod';

export const KarsaAppScalarFieldEnumSchema = z.enum(['id', 'name', 'label', 'description', 'token', 'tokenPromo', 'visible', 'category', 'createdAt', 'updatedAt'])

export type KarsaAppScalarFieldEnum = z.infer<typeof KarsaAppScalarFieldEnumSchema>;