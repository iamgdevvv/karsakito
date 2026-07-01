import * as z from 'zod';
import { UserScalarFieldEnumSchema } from '~generated/prisma-zod/schemas/enums/UserScalarFieldEnum.schema';
import { UserSchema } from '~generated/prisma-zod/schemas/models';

export const UserSchemaPlain = UserSchema.omit({
	isActive: true,
}).extend({
	isActive: z.union([z.boolean(), z.stringbool()]).nullish(),
});

export const PayloadQueryUsersSchema = UserSchemaPlain.partial().extend({
	nextCursor: UserSchemaPlain.shape.id.optional(),
	previousCursor: UserSchemaPlain.shape.id.optional(),
	total: z.number().optional(),
	search: z.string().optional(),
	asc: z.union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()]).optional(),
	desc: z.union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()]).optional(),
	select: z.union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()]).optional(),
});

export const PayloadCreateUserSchema = UserSchemaPlain.pick({
	name: true,
	email: true,
	role: true,
	isActive: true,
}).extend({
	password: z.string().nonempty(),
});

export const PayloadUpdateUserSchema = UserSchemaPlain.pick({
	name: true,
	email: true,
	role: true,
	isActive: true,
})
	.partial()
	.extend({
		userId: UserSchemaPlain.shape.id,
	});

export const PayloadUpdateUserPasswordSchema = z.object({
	userId: UserSchemaPlain.shape.id,
	password: z.string().nonempty(),
});

export const PayloadDeleteUserSchema = z.object({
	userId: UserSchemaPlain.shape.id,
});

export const PayloadUpdateProfileSchema = UserSchemaPlain.pick({
	name: true,
	email: true,
}).partial();

export const PayloadUpdateProfilePasswordSchema = z
	.object({
		curentPassword: z.string().nonempty(),
		password: z.string().nonempty(),
		confirmPassword: z.string().nonempty(),
	})
	.refine(({ password, confirmPassword }) => password === confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export type PayloadQueryUsers = z.infer<typeof PayloadQueryUsersSchema>;
export type PayloadCreateUser = z.infer<typeof PayloadCreateUserSchema>;
export type PayloadUpdateUser = z.infer<typeof PayloadUpdateUserSchema>;
export type PayloadUpdateUserPassword = z.infer<typeof PayloadUpdateUserPasswordSchema>;
export type PayloadDeleteUser = z.infer<typeof PayloadDeleteUserSchema>;
export type PayloadUpdateProfile = z.infer<typeof PayloadUpdateProfileSchema>;
export type PayloadUpdateProfilePassword = z.infer<typeof PayloadUpdateProfilePasswordSchema>;
