import * as z from 'zod';

export const KarsaAppsCategoryScalarFieldEnumSchema = z.enum(['id', 'name'])

export type KarsaAppsCategoryScalarFieldEnum = z.infer<typeof KarsaAppsCategoryScalarFieldEnumSchema>;