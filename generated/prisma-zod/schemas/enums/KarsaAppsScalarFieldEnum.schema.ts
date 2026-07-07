import * as z from 'zod';

export const KarsaAppsScalarFieldEnumSchema = z.enum(['name', 'token', 'tokenPromo', 'visible', 'categoryId'])

export type KarsaAppsScalarFieldEnum = z.infer<typeof KarsaAppsScalarFieldEnumSchema>;