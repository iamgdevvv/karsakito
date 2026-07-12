import * as z from 'zod';
import { LanguageAppSchema } from '~app-modules/schema/app';
import { KarsaSchema, WorkspaceWindowSchema } from '~generated/prisma-zod/schemas/models';

export const KarsaSchemaPlain = KarsaSchema.omit({
	promptJson: true,
}).extend({
	promptJson: z.record(z.string(), z.unknown()).optional(),
});

export const PayloadKarsaPidatoSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	purpose: z.string().nonempty(),
	agenda: z.string().nonempty(),
	speaker: z.string().nonempty(),
	audience: z.string().nonempty(),
	topic: z.string().nonempty(),
	totalSentence: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaPantunSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	type: z.string().nonempty(),
	audience: z.string().nonempty(),
	topic: z.string().nonempty(),
	numberVerses: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaSchemaPlain = KarsaSchemaPlain.omit({
	id: true,
	app: true,
	promptJson: true,
	createdAt: true,
	updatedAt: true,
	userId: true,
	balanceActivityId: true,
	result: true,
});

export const PayloadSubmissionKarsaSchema = z
	.object({
		windowWorkspaceId: WorkspaceWindowSchema.shape.id.optional(),
	})
	.and(
		z.discriminatedUnion('app', [
			z.object({
				app: z.literal(KarsaSchemaPlain.shape.app.enum.pidato),
				payload: PayloadKarsaPidatoSchema,
			}),
			z.object({
				app: z.literal(KarsaSchemaPlain.shape.app.enum.pantun),
				payload: PayloadKarsaPantunSchema,
			}),
		]),
	);

export type KarsaPlain = z.infer<typeof KarsaSchemaPlain>;
export type PayloadKarsaPidato = z.infer<typeof PayloadKarsaPidatoSchema>;
export type PayloadKarsaPantun = z.infer<typeof PayloadKarsaPantunSchema>;
export type PayloadSubmissionKarsa = z.infer<typeof PayloadSubmissionKarsaSchema>;
