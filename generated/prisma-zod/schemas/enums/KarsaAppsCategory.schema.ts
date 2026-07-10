import * as z from 'zod';

export const KarsaAppsCategorySchema = z.enum(['karsawriter', 'karsalator', 'karsalisa', 'karsafrase', 'karsapedia'])

export type KarsaAppsCategory = z.infer<typeof KarsaAppsCategorySchema>;