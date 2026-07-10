import * as z from 'zod';
import { KarsaAppsCategorySchema } from '../enums/KarsaAppsCategory.schema';
import { KarsaAppsNameSchema } from '../enums/KarsaAppsName.schema';

export const KarsaAppsSchema = z.object({
  name: KarsaAppsNameSchema,
  label: z.string(),
  token: z.number().int(),
  tokenPromo: z.number().int().nullish(),
  visible: z.boolean().default(true),
  category: KarsaAppsCategorySchema,
});

export type KarsaAppsType = z.infer<typeof KarsaAppsSchema>;
