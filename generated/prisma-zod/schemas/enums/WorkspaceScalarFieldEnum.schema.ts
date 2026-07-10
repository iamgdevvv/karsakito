import * as z from 'zod';

export const WorkspaceScalarFieldEnumSchema = z.enum(['id', 'createdAt', 'userId'])

export type WorkspaceScalarFieldEnum = z.infer<typeof WorkspaceScalarFieldEnumSchema>;