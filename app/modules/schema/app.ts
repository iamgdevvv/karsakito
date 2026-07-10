import * as z from 'zod';
import { KarsaAppScalarFieldEnumSchema } from '~generated/prisma-zod/schemas/enums/KarsaAppScalarFieldEnum.schema';
import { KarsaAppSchema } from '~generated/prisma-zod/schemas/models';

export const KarsaAppSchemaPlain = KarsaAppSchema.omit({
	token: true,
	tokenPromo: true,
	visible: true,
}).extend({
	token: z.coerce.number(),
	tokenPromo: z.coerce.number().nullish(),
	visible: z.union([z.boolean(), z.stringbool()]),
});

export const PayloadQueryKarsaAppsSchema = KarsaAppSchemaPlain.partial().extend({
	nextCursor: KarsaAppSchemaPlain.shape.id.optional(),
	previousCursor: KarsaAppSchemaPlain.shape.id.optional(),
	total: z.number().optional(),
	search: z.string().optional(),
	asc: z.union([KarsaAppScalarFieldEnumSchema, KarsaAppScalarFieldEnumSchema.array()]).optional(),
	desc: z
		.union([KarsaAppScalarFieldEnumSchema, KarsaAppScalarFieldEnumSchema.array()])
		.optional(),
	select: z
		.union([KarsaAppScalarFieldEnumSchema, KarsaAppScalarFieldEnumSchema.array()])
		.optional(),
});

export const PayloadCreateKarsaAppSchema = KarsaAppSchemaPlain.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).extend({
	visible: KarsaAppSchemaPlain.shape.visible.optional(),
});

export const PayloadUpdateKarsaAppSchema = KarsaAppSchemaPlain.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})
	.partial()
	.extend({
		karsaAppId: KarsaAppSchemaPlain.shape.id,
	});

export type KarsaAppPlain = z.infer<typeof KarsaAppSchemaPlain>;
export type PayloadQueryKarsaApps = z.infer<typeof PayloadQueryKarsaAppsSchema>;
export type PayloadCreateKarsaApp = z.infer<typeof PayloadCreateKarsaAppSchema>;
export type PayloadUpdateKarsaApp = z.infer<typeof PayloadUpdateKarsaAppSchema>;
