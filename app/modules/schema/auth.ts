import * as z from 'zod';
import { UserSchema } from '~generated/prisma-zod/schemas/models';

export const PayloadLoginSchema = z.object({
	email: UserSchema.shape.email,
	password: z.string().nonempty(),
	_redirect: z.string().optional(),
});

export const PayloadRegisterSchema = z.object({
	name: UserSchema.shape.name,
	email: UserSchema.shape.email,
	password: z.string().nonempty(),
});

export type PayloadLogin = z.infer<typeof PayloadLoginSchema>;
export type PayloadRegister = z.infer<typeof PayloadRegisterSchema>;
