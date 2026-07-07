import * as z from 'zod';
import { KarsaAppsNameSchema } from '../enums/KarsaAppsName.schema';

export const KarsaSchema = z.object({
  id: z.string(),
  app: KarsaAppsNameSchema,
  promptJson: z.unknown().refine((val) => { const getDepth = (obj: unknown, depth: number = 0): number => { if (depth > 10) return depth; if (obj === null || typeof obj !== 'object') return depth; const values = Object.values(obj as Record<string, unknown>); if (values.length === 0) return depth; return Math.max(...values.map(v => getDepth(v, depth + 1))); }; return getDepth(val) <= 10; }, "JSON nesting depth exceeds maximum of 10").nullish(),
  result: z.string(),
  reaction: z.boolean().nullish(),
  feedback: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  balanceActivityId: z.string(),
});

export type KarsaType = z.infer<typeof KarsaSchema>;
