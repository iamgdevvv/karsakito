import * as z from 'zod';
import { KarsaAppScalarFieldEnumSchema } from '~generated/prisma-zod/schemas/enums/KarsaAppScalarFieldEnum.schema';
import { KarsaAppSchema } from '~generated/prisma-zod/schemas/models';

export const PayloadQueryKarsaAppsSchema = KarsaAppSchema.partial().extend({
	nextCursor: KarsaAppSchema.shape.id.optional(),
	previousCursor: KarsaAppSchema.shape.id.optional(),
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

export const PayloadCreateKarsaAppSchema = KarsaAppSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const PayloadUpdateKarsaAppSchema = KarsaAppSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})
	.partial()
	.extend({
		karsaAppId: KarsaAppSchema.shape.id,
	});

export type PayloadQueryKarsaApps = z.infer<typeof PayloadQueryKarsaAppsSchema>;
export type PayloadCreateKarsaApp = z.infer<typeof PayloadCreateKarsaAppSchema>;
export type PayloadUpdateKarsaApp = z.infer<typeof PayloadUpdateKarsaAppSchema>;
