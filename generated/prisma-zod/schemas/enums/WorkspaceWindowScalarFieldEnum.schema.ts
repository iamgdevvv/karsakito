import * as z from 'zod';

export const WorkspaceWindowScalarFieldEnumSchema = z.enum(['id', 'title', 'props', 'createdAt', 'updatedAt', 'workspaceId', 'karsaId'])

export type WorkspaceWindowScalarFieldEnum = z.infer<typeof WorkspaceWindowScalarFieldEnumSchema>;