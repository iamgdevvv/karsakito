import * as z from 'zod';

export const WorkspaceScalarFieldEnumSchema = z.enum(['id', 'title', 'createdAt', 'userId'])

export type WorkspaceScalarFieldEnum = z.infer<typeof WorkspaceScalarFieldEnumSchema>;