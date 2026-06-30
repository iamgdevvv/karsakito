import * as z from 'zod';
import { UserSchemaPlain } from '~app-modules/schema/user';

export const PayloadLoginSchema = z.object({
	email: UserSchemaPlain.shape.email,
	password: z.string().nonempty(),
	_redirect: z.string().optional(),
});

export const PayloadRegisterSchema = z.object({
	name: UserSchemaPlain.shape.name,
	email: UserSchemaPlain.shape.email,
	password: z.string().nonempty(),
});

export type PayloadLogin = z.infer<typeof PayloadLoginSchema>;
export type PayloadRegister = z.infer<typeof PayloadRegisterSchema>;
