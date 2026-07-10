import * as z from 'zod';

export const WorkspaceSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.date(),
  userId: z.string(),
});

export type WorkspaceType = z.infer<typeof WorkspaceSchema>;
