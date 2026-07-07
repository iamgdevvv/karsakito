import * as z from 'zod';
import { KarsaAppsNameSchema } from '../enums/KarsaAppsName.schema';

export const KarsaAppsSchema = z.object({
  name: KarsaAppsNameSchema,
  token: z.number().int(),
  tokenPromo: z.number().int().nullish(),
  visible: z.boolean().default(true),
  categoryId: z.string(),
});

export type KarsaAppsType = z.infer<typeof KarsaAppsSchema>;
