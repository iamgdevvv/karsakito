import * as z from 'zod';

export const KarsaAppsCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type KarsaAppsCategoryType = z.infer<typeof KarsaAppsCategorySchema>;
