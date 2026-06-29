import * as z from 'zod';
import { UserSchema } from '~generated/prisma-zod/schemas/models';

export const PayloadCreateUserSchema = UserSchema.pick({
	name: true,
	email: true,
	role: true,
	isActive: true,
}).extend({
	password: z.string().nonempty(),
});

export const PayloadUpdateUserSchema = UserSchema.pick({
	name: true,
	email: true,
	role: true,
	isActive: true,
})
	.partial()
	.extend({
		userId: UserSchema.shape.id,
	});

export const PayloadUpdateUserPasswordSchema = z.object({
	userId: UserSchema.shape.id,
	password: z.string().nonempty(),
});

export const PayloadDeleteUserSchema = z.object({
	userId: UserSchema.shape.id,
});

export const PayloadUpdateProfileSchema = UserSchema.pick({
	name: true,
	email: true,
}).partial();

export const PayloadUpdateProfilePasswordSchema = z
	.object({
		curentPassword: z.string().nonempty(),
		password: z.string().nonempty(),
		confirmPassword: z.string().nonempty(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export type PayloadCreateUser = z.infer<typeof PayloadCreateUserSchema>;
export type PayloadUpdateUser = z.infer<typeof PayloadUpdateUserSchema>;
export type PayloadUpdateUserPassword = z.infer<typeof PayloadUpdateUserPasswordSchema>;
export type PayloadDeleteUser = z.infer<typeof PayloadDeleteUserSchema>;
export type PayloadUpdateProfile = z.infer<typeof PayloadUpdateProfileSchema>;
export type PayloadUpdateProfilePassword = z.infer<typeof PayloadUpdateProfilePasswordSchema>;
