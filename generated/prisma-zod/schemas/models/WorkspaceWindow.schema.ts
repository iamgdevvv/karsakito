import * as z from 'zod';

export const WorkspaceWindowSchema = z.object({
  id: z.string(),
  title: z.string(),
  props: z.unknown().refine((val) => { const getDepth = (obj: unknown, depth: number = 0): number => { if (depth > 10) return depth; if (obj === null || typeof obj !== 'object') return depth; const values = Object.values(obj as Record<string, unknown>); if (values.length === 0) return depth; return Math.max(...values.map(v => getDepth(v, depth + 1))); }; return getDepth(val) <= 10; }, "JSON nesting depth exceeds maximum of 10").nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  workspaceId: z.string(),
  karsaId: z.string(),
});

export type WorkspaceWindowType = z.infer<typeof WorkspaceWindowSchema>;
