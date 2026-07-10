import * as z from 'zod';
import { UserRoleSchema } from '../enums/UserRole.schema';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  role: UserRoleSchema.default("CUSTOMER"),
  isActive: z.boolean().default(true),
  timezone: z.string().default("Asia/Jakarta"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserType = z.infer<typeof UserSchema>;
