import * as z from 'zod';
import { Apps } from '~app-modules/enum-options';

export const AppSchema = z.enum(Apps);

export const PayloadWindowWorkspaceSchema = z.object({
	title: z.string().nonempty(),
	app: AppSchema,
});

export type PayloadWindowWorkspace = z.infer<typeof PayloadWindowWorkspaceSchema>;
