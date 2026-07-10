import * as z from 'zod';
import { KarsaAppsCategorySchema } from '../enums/KarsaAppsCategory.schema';
import { KarsaAppsNameSchema } from '../enums/KarsaAppsName.schema';

export const KarsaAppSchema = z.object({
  id: z.string(),
  name: KarsaAppsNameSchema,
  label: z.string(),
  description: z.string().nullish(),
  token: z.number().int(),
  tokenPromo: z.number().int().nullish(),
  visible: z.boolean().default(true),
  category: KarsaAppsCategorySchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type KarsaAppType = z.infer<typeof KarsaAppSchema>;
