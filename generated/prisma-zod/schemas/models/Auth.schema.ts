import * as z from 'zod';

export const AuthSchema = z.object({
  hash: z.string(),
  userId: z.string(),
});

export type AuthType = z.infer<typeof AuthSchema>;
