import type { WindowBaseProps } from '@gfazioli/mantine-window';
import * as z from 'zod';
import { KarsaSchemaPlain } from '~app-modules/schema/karsa';
import { WorkspaceScalarFieldEnumSchema } from '~generated/prisma-zod/schemas/enums/WorkspaceScalarFieldEnum.schema';
import { WorkspaceSchema, WorkspaceWindowSchema } from '~generated/prisma-zod/schemas/models';

export const WorkspaceWindowSchemaPlain = WorkspaceWindowSchema.omit({
	props: true,
}).extend({
	props: z
		.object({
			id: z.string().optional(),
			title: z.string().optional(),
			opened: z.boolean().optional(),
			collapsed: z.boolean().optional(),
			x: z.union([z.number(), z.string()]).optional(),
			y: z.union([z.number(), z.string()]).optional(),
			width: z.union([z.number(), z.string()]).optional(),
			height: z.union([z.number(), z.string()]).optional(),
			defaultWidth: z.union([z.number(), z.string()]).optional(),
			defaultHeight: z.union([z.number(), z.string()]).optional(),
			minWidth: z.union([z.number(), z.string()]).optional(),
			minHeight: z.union([z.number(), z.string()]).optional(),
			maxWidth: z.union([z.number(), z.string()]).optional(),
			maxHeight: z.union([z.number(), z.string()]).optional(),
			// color: z.string().optional(),
			// withBorder: z.boolean().optional(),
			// resizeable: z.enum(['none', 'both', 'horizontal', 'vertical'] satisfies WindowBaseProps['resizable'][]).optional(),
			// fullSizeResizeHandles: z.boolean().optional(),
			// draggable: z.enum(['none', 'both', 'header', 'window'] satisfies WindowBaseProps['draggable'][]).optional(),
			// withCollapseButton: z.boolean().optional(),
			// collapsable: z.boolean().optional(),
			// withCloseButton: z.boolean().optional(),
			// withToolsButton: z.boolean().optional(),
			// withScrollArea: z.boolean().optional(),
			// controlsPosition: z.enum(['left', "right"] satisfies WindowBaseProps['controlsPosition'][]).optional(),
			// controlsOrder: z.enum(['close', 'collapse', 'tools'] satisfies WindowBaseProps['controlsOrder']).array().optional(),
			// defaultX: z.union([z.number(), z.string()]).optional(),
			// defaultY: z.union([z.number(), z.string()]).optional(),
		})
		.nullish() satisfies z.ZodType<
		| Pick<
				WindowBaseProps,
				| 'id'
				| 'title'
				| 'opened'
				| 'collapsed'
				| 'x'
				| 'y'
				| 'width'
				| 'height'
				| 'defaultWidth'
				| 'defaultHeight'
				| 'minWidth'
				| 'minHeight'
				| 'maxWidth'
				| 'maxHeight'
		  >
		| null
		| undefined
	>,
});

export const PayloadQueryWorkspacesSchema = WorkspaceSchema.partial().extend({
	nextCursor: WorkspaceSchema.shape.id.optional(),
	previousCursor: WorkspaceSchema.shape.id.optional(),
	total: z.number().optional(),
	search: z.string().optional(),
	asc: z
		.union([WorkspaceScalarFieldEnumSchema, WorkspaceScalarFieldEnumSchema.array()])
		.optional(),
	desc: z
		.union([WorkspaceScalarFieldEnumSchema, WorkspaceScalarFieldEnumSchema.array()])
		.optional(),
	select: z
		.union([WorkspaceScalarFieldEnumSchema, WorkspaceScalarFieldEnumSchema.array()])
		.optional(),
});

export const PayloadWindowWorkspaceSchema = WorkspaceWindowSchemaPlain.pick({
	id: true,
	title: true,
	props: true,
}).extend({
	app: KarsaSchemaPlain.shape.app,
	karsa: KarsaSchemaPlain.omit({
		app: true,
		createdAt: true,
		updatedAt: true,
		userId: true,
		balanceActivityId: true,
	}).nullish(),
});

export type WorkspaceWindowPlain = z.infer<typeof WorkspaceWindowSchemaPlain>;
export type PayloadWindowWorkspace = z.infer<typeof PayloadWindowWorkspaceSchema>;
